"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SERVICES } from "@/app/services/servicesData";

gsap.registerPlugin(ScrollTrigger);

const HEADING_GRADIENT =
  "linear-gradient(105deg, #7DFF00 0%, #B2FF00 49%, #C8FF00 100%)";

export default function ServicesShowcase() {
  const rootRef = useRef(null);
  const panelRefs = useRef([]);
  const cardRefs = useRef([]);
  const pathname = usePathname();

  /* Lenis + client-side nav: ScrollTrigger positions are stale until a refresh. */
  useLayoutEffect(() => {
    if (pathname !== "/services") return undefined;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => ScrollTrigger.refresh()),
    );
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const panels = panelRefs.current.filter(Boolean);
    const cards = cardRefs.current.filter(Boolean);
    if (!root || cards.length === 0) return undefined;

    const mm = gsap.matchMedia();

    /* Desktop: sticky stack. Each panel pins, the next rises over it, and the
       covered panel recedes (scale + dim + lift) so the stack reads with depth.
       Content streams in as each panel enters. */
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        cards.forEach((card, i) => {
          const items = card.querySelectorAll("[data-reveal]");

          /* entrance — content streams in as the panel scrolls into view */
          gsap.from(items, {
            autoAlpha: 0,
            y: 26,
            filter: "blur(8px)",
            ease: "power3.out",
            duration: 0.7,
            stagger: 0.08,
            scrollTrigger: {
              trigger: panels[i],
              start: "top 70%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          });

          /* recede — as the next panel covers this one, it shrinks + dims back */
          if (i < cards.length - 1) {
            gsap.to(card, {
              scale: 0.92,
              autoAlpha: 0.55,
              y: -28,
              ease: "none",
              scrollTrigger: {
                trigger: panels[i],
                start: "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
          }
        });
      },
    );

    /* Mobile: normal stacked cards, one-shot reveal on enter. */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      cards.forEach((card, i) => {
        const items = card.querySelectorAll("[data-reveal]");
        gsap.from(items, {
          autoAlpha: 0,
          y: 22,
          ease: "power2.out",
          duration: 0.55,
          stagger: 0.06,
          scrollTrigger: { trigger: panels[i], start: "top 82%", once: true },
        });
      });
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
    <section ref={rootRef} className="relative z-10" aria-label="What we build">
      {SERVICES.map((s, i) => (
        <div
          key={s.slug}
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
          className="px-(--gutter) py-6 md:sticky md:top-(--header-offset) md:flex md:h-(--viewport-below-header) md:items-center md:py-0"
        >
          <article
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="relative mx-auto grid w-full max-w-(--content-max) grid-cols-1 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0e0e0e]/95 shadow-[0_-8px_50px_rgba(0,0,0,0.5),0_40px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl will-change-[transform,opacity] md:h-[86%] md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
          >
            {/* lime top accent */}
            <span
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--hero-accent)/60 to-transparent"
              aria-hidden
            />

            {/* LEFT — content */}
            <div className="flex flex-col justify-center gap-5 p-7 sm:p-9 md:p-12 lg:p-14">
              <div data-reveal className="flex items-center gap-4">
                <span
                  className="font-heading text-[clamp(2rem,3.4vw,3.25rem)] font-normal leading-none tabular-nums"
                  style={{
                    backgroundImage: HEADING_GRADIENT,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {s.index}
                </span>
                <span className="h-px flex-1 bg-white/12" aria-hidden />
              </div>

              <h3
                data-reveal
                className="font-heading text-[clamp(1.5rem,2.6vw,2.5rem)] font-normal leading-[1.08] tracking-[-0.02em] text-white"
              >
                {s.title}
              </h3>

              <p data-reveal className="max-w-[46ch] text-[clamp(0.9rem,1vw,1.05rem)] font-medium leading-snug text-(--hero-accent)/90">
                {s.tagline}
              </p>

              <p data-reveal className="max-w-[52ch] text-[0.9rem] leading-relaxed text-white/60 md:text-[0.95rem]">
                {s.overview[0]}
              </p>

              <ul data-reveal className="grid grid-cols-1 gap-x-6 gap-y-2 pt-1 sm:grid-cols-2">
                {s.capabilities.map((c) => (
                  <li key={c.title} className="flex items-center gap-2.5 text-[0.84rem] text-white/75">
                    <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-(--hero-accent)" aria-hidden />
                    {c.title}
                  </li>
                ))}
              </ul>

              <div data-reveal className="pt-2">
                <Link
                  href="/contact"
                  className="header-cta header-cta--lime"
                  aria-label={`Start a project — ${s.title}`}
                >
                  <Image
                    src="/images/logo-black.png"
                    alt=""
                    width={22}
                    height={22}
                    className="h-[1.2em] w-auto object-contain"
                    aria-hidden
                  />
                  <span>Start a project</span>
                </Link>
              </div>
            </div>

            {/* RIGHT — framed visual */}
            <div data-reveal className="relative min-h-[16rem] overflow-hidden border-t border-white/10 md:min-h-0 md:border-l md:border-t-0">
              <Image
                src={s.image}
                alt={s.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
              {/* lime wash + readability gradient */}
              <div className="absolute inset-0 bg-linear-to-tr from-(--section-canvas)/85 via-(--section-canvas)/25 to-transparent" aria-hidden />
              <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_85%_15%,rgba(204,255,0,0.12),transparent_55%)]" aria-hidden />
              <span
                className="pointer-events-none absolute bottom-5 right-5 font-heading text-[0.7rem] uppercase tracking-[0.3em] text-white/40"
                aria-hidden
              >
                LogixaLab
              </span>
            </div>
          </article>
        </div>
      ))}
    </section>
  );
}
