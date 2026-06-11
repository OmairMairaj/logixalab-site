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

    /* Always begin a fresh page load at the top. These pages are scroll-driven
       stories with pinned/scrubbed timelines; the browser's default
       scrollRestoration:"auto" puts you back mid-scroll on refresh, which leaves
       ScrollTrigger at a mid-progress frame while the mount-time entrance tweens
       replay — e.g. the team page's faded-out "scroll to explore" cue blur-rises
       back in. Manual restoration + scroll-to-top makes refresh restart from the
       top. Runs once per full load (layout doesn't remount on SPA navigation), so
       in-app route changes are unaffected; #hash links are still honored. */
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (!window.location.hash) window.scrollTo(0, 0);

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
  }, []);

  return children;
}
