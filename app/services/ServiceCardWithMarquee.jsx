"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { forwardRef, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import "@/src/component/FlowingMenu.css";
import "./services-card-marquee.css";

const animationDefaults = { duration: 0.6, ease: "expo" };

const distMetric = (x, y, x2, y2) => {
  const xDiff = x - x2;
  const yDiff = y - y2;
  return xDiff * xDiff + yDiff * yDiff;
};

const findClosestEdge = (mouseX, mouseY, width, height) => {
  const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
  const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
  return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
};

const ServiceCardWithMarquee = forwardRef(function ServiceCardWithMarquee(
  { item, serviceHref, dimmed, marqueeImage, speed = 18 },
  ref
) {
  const itemRef = useRef(null);
  const marqueeRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const animationRef = useRef(null);
  const [repetitions, setRepetitions] = useState(4);
  /** CSS `group-hover` was unreliable here (stacking + opacity on parent); drive hide explicitly. */
  const [hovered, setHovered] = useState(false);

  const { index, title, description } = item;

  const setCardNode = (node) => {
    itemRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector(".marquee__part");
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [title, marqueeImage]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector(".marquee__part");
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;
      if (animationRef.current) animationRef.current.kill();
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    };

    const timer = setTimeout(setupMarquee, 50);
    return () => {
      clearTimeout(timer);
      if (animationRef.current) animationRef.current.kill();
    };
  }, [title, marqueeImage, repetitions, speed]);

  const handleMarqueeEnter = (ev) => {
    const el = itemRef.current;
    if (!el || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = el.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" }, 0);
  };

  const handleMarqueeLeave = (ev) => {
    const el = itemRef.current;
    if (!el || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = el.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .to(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0);
  };

  const hideStaticCopy = hovered;

  return (
    <Link
      href={serviceHref}
      ref={setCardNode}
      aria-label={`${title} — view service details`}
      className={clsx(
        "service-card-flowing relative block select-none overflow-hidden rounded-2xl border border-white/12 bg-black/28 shadow-[0_12px_48px_rgba(0,0,0,0.35)] backdrop-blur-md outline-none transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-(--hero-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-black/80 md:rounded-3xl",
        dimmed ? "opacity-75 md:opacity-45" : "opacity-100"
      )}
      onMouseEnter={(e) => {
        setHovered(true);
        handleMarqueeEnter(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        handleMarqueeLeave(e);
      }}
    >
      <div
        ref={marqueeRef}
        className="marquee service-card-flowing__marquee"
        style={{ backgroundColor: "var(--hero-accent)" }}
      >
        <div className="marquee__inner-wrap">
          <div className="marquee__inner" ref={marqueeInnerRef} aria-hidden="true">
            {[...Array(repetitions)].map((_, idx) => (
              <div className="marquee__part service-card-flowing__part" key={idx} style={{ color: "#0d0d0d" }}>
                <span>{title}</span>
                <div
                  className="marquee__img service-card-flowing__img"
                  style={{ backgroundImage: `url(${marqueeImage})` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="service-card-flowing__content relative z-10 grid grid-cols-1 items-start gap-3 p-4 sm:p-5 md:grid-cols-[minmax(2.5rem,auto)_minmax(0,1.05fr)_minmax(0,1.35fr)_auto] md:items-center md:gap-6 md:p-8 lg:gap-8">
        <span
          aria-hidden={hideStaticCopy}
          className={clsx(
            "font-heading text-[clamp(1.5rem,9vw,2.75rem)] font-normal tabular-nums leading-none tracking-tight transition-[opacity,visibility] duration-200 ease-out md:text-right",
            dimmed ? "text-white/25" : "text-white/90",
            hideStaticCopy && "pointer-events-none invisible opacity-0"
          )}
        >
          {index}
        </span>

        <h3
          aria-hidden={hideStaticCopy}
          className={clsx(
            "m-0 font-heading text-[clamp(0.95rem,4.8vw,1.35rem)] font-semibold leading-snug tracking-tight text-white transition-[opacity,visibility] duration-200 ease-out",
            hideStaticCopy && "pointer-events-none invisible opacity-0"
          )}
        >
          {title}
        </h3>

        <p
          aria-hidden={hideStaticCopy}
          className={clsx(
            "m-0 max-w-prose text-[0.875rem] leading-relaxed text-white/60 transition-[opacity,visibility] duration-200 ease-out md:text-[0.9375rem]",
            hideStaticCopy && "pointer-events-none invisible opacity-0"
          )}
        >
          {description}
        </p>

        <span
          aria-hidden={hideStaticCopy}
          className={clsx(
            "relative z-20 inline-flex w-fit shrink-0 items-center gap-2 text-sm font-semibold text-(--hero-accent) transition-[opacity,visibility] duration-200 ease-out md:justify-self-end",
            hideStaticCopy && "pointer-events-none invisible opacity-0"
          )}
        >
          <Image
            src={marqueeImage}
            alt=""
            width={28}
            height={28}
            className="h-6 w-6 shrink-0 object-contain"
          />
          View service
        </span>
      </div>
    </Link>
  );
});

ServiceCardWithMarquee.displayName = "ServiceCardWithMarquee";

export default ServiceCardWithMarquee;
