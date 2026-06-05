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

const TEAM_PARA =
  "At LOGIXA LAB, we are a collective of engineers, designers, and AI specialists united by one mission — to build intelligent systems that shape the future of business.";

/** Faint binary texture in the top-right + bottom-left corners — the Figma's
 *  only background ornament (no lime burst on this page). */
function BinaryBackdrop() {
  return (
    <>
      <div className="absolute right-[-200px] top-[-100px] h-[62vh] w-[46vw] opacity-[0.55]">
        <Image
          src="/images/binary.png"
          alt=""
          fill
          className="object-contain object-top-right"
          sizes="46vw"
          priority={false}
        />
      </div>
      <div className="absolute bottom-[-100px] left-[-200px] h-[55vh] w-[44vw] rotate-180 opacity-[0.4]">
        <Image
          src="/images/binary.png"
          alt=""
          fill
          className="object-contain object-top-right"
          sizes="44vw"
          priority={false}
        />
      </div>
    </>
  );
}

/** One member card — voxel avatar in a rounded panel with a lime role pill,
 *  lime name + muted description beneath (matches the Figma). */
function TeamCard({ member, style }) {
  return (
    <article
      data-team-card
      className="shrink-0 will-change-[opacity,transform]"
      style={style}
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-white/[0.07] via-white/[0.02] to-black/50 shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
        style={{ aspectRatio: "0.62 / 1" }}
      >
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 70vw, 280px"
          className="object-contain object-bottom"
        />
        <span className="absolute bottom-3 left-3 whitespace-nowrap rounded-full bg-(--hero-accent) px-3 py-1 text-[11px] font-semibold tracking-wide text-(--hero-canvas) shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
          {member.role}
        </span>
      </div>

      <h3 className="font-heading mt-4 text-[clamp(1rem,1.4vw,1.25rem)] font-normal leading-tight text-(--hero-accent)">
        {member.name}
      </h3>
      <p className="mt-2 max-w-[26ch] text-[12.5px] leading-relaxed text-white/55">
        {member.description}
      </p>
    </article>
  );
}

const CARD_STYLE = { width: "clamp(200px, 28vw, 300px)" };

/**
 * Team page scroll experience (desktop, scrub-driven):
 *   Phase A — big "The Minds / Behind Logixa Lab" holds, centered-left & large.
 *   Phase B — headline shrinks + docks to the top-left; paragraph fades in top-right.
 *   Phase C — the team card rail reveals in the lower band.
 *   Phase D — the rail scrubs horizontally (left → right reading) to walk the team.
 *   Phase E — backdrop + content fade so the Contact section reveals cleanly.
 *
 * Mobile + reduced-motion fall back to a static, natively-scrollable layout.
 */
export default function TeamScrollExperience() {
  const scrollRootRef = useRef(null);
  const bgLayerRef = useRef(null);
  const heroBlockRef = useRef(null);
  const paraRef = useRef(null);
  const railContainerRef = useRef(null);
  const railRef = useRef(null);

  useLayoutEffect(() => {
    const scrollRoot = scrollRootRef.current;
    const bgLayer = bgLayerRef.current;
    const heroBlock = heroBlockRef.current;
    const para = paraRef.current;
    const railContainer = railContainerRef.current;
    const rail = railRef.current;

    if (!scrollRoot || !heroBlock || !para || !railContainer || !rail) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        /* Hero starts off-screen to the right so the whole strip streams in
           horizontally (no vertical fade) in one continuous leftward scrub. */
        const railStartX = () => window.innerWidth * 0.62;
        const railEndX = () =>
          -Math.max(rail.scrollWidth - window.innerWidth, 0);

        /* Big hero: the headline is laid out at its DOCKED size in CSS and scaled
           UP here via a GPU transform — composited = smooth, and scale 1 at rest
           keeps the docked text (the state you dwell on) perfectly sharp. */
        gsap.set(bgLayer, { autoAlpha: 1 });
        gsap.set(heroBlock, {
          transformOrigin: "left top",
          scale: 1.9,
          y: () => window.innerHeight * 0.15,
          force3D: true,
        });
        gsap.set(para, { autoAlpha: 0, x: 48 });
        gsap.set(railContainer, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(rail, { x: railStartX, force3D: true });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scrollRoot,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });

        /* Phase A — hold the big headline (0 → 0.12). */

        /* Phase B — shrink + dock the headline to the top-left (GPU scale). */
        const dockStart = 0.12;
        const dockDur = 0.28;
        tl.to(
          heroBlock,
          { scale: 1, y: 0, ease: "power3.inOut", duration: dockDur },
          dockStart,
        );

        /* Paragraph slides in top-right as the headline settles. */
        tl.to(
          para,
          { autoAlpha: 1, x: 0, ease: "power2.out", duration: dockDur * 0.7 },
          dockStart + dockDur * 0.4,
        );

        /* Phase C — the rail becomes visible just before it starts streaming in. */
        const railStart = dockStart + dockDur * 0.7;
        tl.to(
          railContainer,
          {
            autoAlpha: 1,
            pointerEvents: "auto",
            ease: "none",
            duration: 0.08,
          },
          railStart,
        );

        /* Phase D — one continuous horizontal scrub: cards stream in from the
           right and walk leftward through the whole team (no vertical motion). */
        const moveStart = railStart + 0.04;
        const moveDur = 1.7;
        tl.fromTo(
          rail,
          { x: railStartX },
          { x: railEndX, ease: "none", duration: moveDur },
          moveStart,
        );

        /* Phase E — outro fade so the Contact section reveals cleanly. */
        const outroStart = moveStart + moveDur + 0.18;
        tl.to(
          [bgLayer, heroBlock, para, railContainer],
          { autoAlpha: 0, ease: "power1.in", duration: 0.4 },
          outroStart,
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
    <section className="relative bg-black text-white">
      <h1 className="sr-only">The Minds Behind Logixa Lab — Our Team</h1>

      {/* ───────────────────── Desktop scrub experience ───────────────────── */}
      <div className="hidden motion-safe:md:block">
        {/* Fixed binary backdrop — fades out in Phase E. */}
        <div
          ref={bgLayerRef}
          className="pointer-events-none fixed inset-0 z-0 will-change-[opacity]"
          aria-hidden
        >
          <BinaryBackdrop />
        </div>

        {/* Headline — anchored top-left, starts scaled-up (big) then docks. */}
        <div
          ref={heroBlockRef}
          className="pointer-events-none fixed left-(--gutter) top-[calc(var(--header-offset)+4vh)] z-30 will-change-transform"
        >
          <h2
            className="font-heading text-[clamp(1.9rem,4.4vw,3.4rem)] font-normal leading-[0.98] tracking-[-0.03em] text-white antialiased"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.45)" }}
          >
            The Minds
          </h2>
          <p className="font-heading mt-1 text-[clamp(1.4rem,3.2vw,2.6rem)] font-normal leading-[1.02] tracking-[-0.02em] text-white/85 antialiased">
            Behind Logixa Lab
          </p>
        </div>

        {/* Intro paragraph — top-right, fades in as the headline docks. */}
        <p
          ref={paraRef}
          className="pointer-events-none fixed right-(--gutter) top-[calc(var(--header-offset)+4vh)] z-30 max-w-[320px] text-right text-[clamp(0.8rem,0.95vw,0.95rem)] leading-relaxed text-white/70 will-change-[opacity,transform]"
          dangerouslySetInnerHTML={{
            __html: TEAM_PARA.replace("—", "&mdash;"),
          }}
        />

        {/* Team rail — lower band, horizontal scrub. */}
        <div
          ref={railContainerRef}
          className="pointer-events-none fixed inset-x-0 bottom-[6vh] top-[30%] z-20 flex items-center will-change-[opacity,visibility]"
          aria-hidden
        >
          <div
            ref={railRef}
            className="flex items-start gap-6 will-change-transform lg:gap-6"
            style={{ paddingLeft: "var(--gutter)", paddingRight: "max(14vw, 6rem)" }}
          >
            {TEAM.map((member) => (
              <TeamCard key={member.name} member={member} style={CARD_STYLE} />
            ))}
          </div>
        </div>

        {/* Scroll spacer — drives the scrubbed timeline. */}
        <div
          ref={scrollRootRef}
          className="min-h-[500vh] w-full"
          aria-hidden
        />
      </div>

      {/* ──────────── Static fallback (mobile + reduced-motion) ──────────── */}
      <div className="relative block overflow-hidden px-(--gutter) pb-24 pt-[calc(var(--header-offset)+4rem)] motion-safe:md:hidden">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <BinaryBackdrop />
        </div>

        <div className="relative z-10">
          <h2 className="font-heading text-[clamp(2rem,9vw,3rem)] font-normal leading-[1.0] tracking-[-0.02em] text-white">
            The Minds
            <br />
            Behind Logixa Lab
          </h2>
          <p
            className="mt-5 max-w-[42ch] text-sm leading-relaxed text-white/70"
            dangerouslySetInnerHTML={{
              __html: TEAM_PARA.replace("—", "&mdash;"),
            }}
          />

          {/* Native horizontal swipe rail. */}
          <div className="mt-10 -mx-(--gutter) flex snap-x snap-mandatory gap-5 overflow-x-auto px-(--gutter) pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TEAM.map((member) => (
              <div key={member.name} className="snap-start">
                <TeamCard
                  member={member}
                  style={{ width: "clamp(220px, 72vw, 280px)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
