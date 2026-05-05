"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ServiceCardWithMarquee from "@/app/services/ServiceCardWithMarquee";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_IMAGE = "/images/Icon Gradient.png";

const SERVICES = [
  {
    index: "01",
    title: "AI Agents & Automation",
    description:
      "Automate repetitive workflows and deploy intelligent agents that work 24/7 across your operations.",
  },
  {
    index: "02",
    title: "AI SaaS Products",
    description:
      "Ship subscription-ready AI products with billing, onboarding, and analytics built for scale.",
  },
  {
    index: "03",
    title: "Custom Software Development",
    description:
      "End-to-end web and backend systems tailored to your stack, security model, and growth roadmap.",
  },
  {
    index: "04",
    title: "Data & ML Engineering",
    description:
      "Pipelines, feature stores, and model lifecycle tooling so your teams can train, evaluate, and deploy with confidence.",
  },
  {
    index: "05",
    title: "Cloud & DevOps",
    description:
      "Infrastructure as code, observability, and resilient deployments on AWS, GCP, or hybrid environments.",
  },
  {
    index: "06",
    title: "Product Design & UX",
    description:
      "Research, design systems, and interfaces that make complex AI capabilities feel simple for end users.",
  },
];

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
  const centeredIndex = useCenteredCardIndex(cardsRef, SERVICES.length);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 80, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            toggleActions: "play none none none",
          },
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        }
      );
    }, section);

    return () => ctx.revert();
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
              <li key={item.index}>
                <ServiceCardWithMarquee
                  ref={(el) => {
                    cardsRef.current[i] = el;
                  }}
                  item={item}
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
