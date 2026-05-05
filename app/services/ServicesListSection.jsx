"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ServiceCardWithMarquee from "@/app/services/ServiceCardWithMarquee";
import { SERVICES } from "@/app/services/servicesData";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_IMAGE = "/images/Icon Gradient.png";

function useCenteredCardIndex(cardRefs, listLength) {
  const [centeredIndex, setCenteredIndex] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (listLength === 0) return undefined;

    const measure = () => {
      const cy = window.innerHeight * 0.5;
      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height * 0.5;
        const d = Math.abs(mid - cy);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });

      setCenteredIndex((prev) => (prev !== best ? best : prev));
    };

    const onScrollOrResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cardRefs, listLength]);

  return centeredIndex;
}

export default function ServicesListSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const pathname = usePathname();
  const centeredIndex = useCenteredCardIndex(cardsRef, SERVICES.length);

  /** Lenis + client navigations: ST positions are wrong until refresh. */
  useEffect(() => {
    if (pathname !== "/services") return undefined;
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let ctx;
    let cancelled = false;
    let rafId = 0;
    let attempts = 0;

    const trySetup = () => {
      if (cancelled) return;
      attempts += 1;
      const cards = cardsRef.current.filter(Boolean);
      if (cards.length < SERVICES.length && attempts < 40) {
        rafId = window.requestAnimationFrame(trySetup);
        return;
      }
      if (cards.length === 0) return;

      ctx = gsap.context(() => {
        /* Don’t use autoAlpha:0 — if ST/Lenis misses a tick (SPA nav), cards stay visible. */
        gsap.fromTo(
          cards,
          { y: 48 },
          {
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              toggleActions: "play none none none",
              invalidateOnRefresh: true,
            },
            onComplete: () => {
              ScrollTrigger.refresh();
            },
          }
        );
      }, section);

      window.requestAnimationFrame(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    };

    trySetup();

    return () => {
      cancelled = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-clip bg-transparent py-16 text-white md:py-24"
      aria-labelledby="services-list-heading"
    >
      <div className="relative mx-auto w-full max-w-[min(100%,1200px)] px-5 md:px-10">
        <h2 id="services-list-heading" className="sr-only">
          What we build
        </h2>

        <ul className={clsx("m-0 list-none space-y-6 p-0 md:space-y-8")}>
          {SERVICES.map((item, i) => {
            const dimmed = centeredIndex !== i;
            return (
              <li key={item.slug}>
                <ServiceCardWithMarquee
                  ref={(el) => {
                    cardsRef.current[i] = el;
                  }}
                  item={item}
                  serviceHref={`/services/${item.slug}`}
                  dimmed={dimmed}
                  marqueeImage={MARQUEE_IMAGE}
                  speed={18}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
