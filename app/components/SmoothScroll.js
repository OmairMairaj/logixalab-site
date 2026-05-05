"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useInsertionEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis + GSAP ScrollTrigger.
 *
 * Runs in useInsertionEffect so setup happens before child useLayoutEffect hooks.
 * (Otherwise LandingScrollExperience’s ScrollTrigger would register before scrollerProxy/Lenis.)
 *
 * Contact page uses native scrolling only — Lenis + ScrollTrigger’s window proxy can leave the
 * scroll range out of sync with shorter pages, so the form card appears clipped with no way to scroll.
 */
export default function SmoothScroll({ children }) {
  const pathname = usePathname();
  const lenisEnabled = pathname !== "/contact";

  useInsertionEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (!lenisEnabled) {
      ScrollTrigger.scrollerProxy(window);
      ScrollTrigger.refresh();
      return undefined;
    }
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

    const onScrollTriggerRefresh = () => {
      lenis.resize();
    };
    ScrollTrigger.addEventListener("refresh", onScrollTriggerRefresh);

    lenis.on("scroll", ScrollTrigger.update);

    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.removeEventListener("refresh", onScrollTriggerRefresh);
      gsap.ticker.remove(tickerFn);
      ScrollTrigger.scrollerProxy(window);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, [lenisEnabled]);

  return children;
}
