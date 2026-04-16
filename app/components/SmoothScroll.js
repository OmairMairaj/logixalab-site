"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInsertionEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis + GSAP ScrollTrigger.
 *
 * Runs in useInsertionEffect so setup happens before child useLayoutEffect hooks.
 * (Otherwise LandingScrollExperience’s ScrollTrigger would register before scrollerProxy/Lenis.)
 */
export default function SmoothScroll({ children }) {
  useInsertionEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      autoRaf: false,
      anchors: true,
    });

    ScrollTrigger.scrollerProxy(window, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tickerFn);
      ScrollTrigger.scrollerProxy(window);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, []);

  return children;
}
