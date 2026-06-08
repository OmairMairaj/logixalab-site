import gsap from "gsap";
import { useLayoutEffect } from "react";

/**
 * Shared hero entrance — blur-rise stagger on every `[data-hero]` element inside
 * `rootRef`. Honors prefers-reduced-motion (elements simply appear). Used by the
 * /work, /services, /contact heroes. (The /team opening frame runs the same
 * entrance inline in TeamScrollExperience, alongside its scrub timeline.)
 */
export default function useHeroEntrance(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const items = root.querySelectorAll("[data-hero]");
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(items, { autoAlpha: 0, y: 28, filter: "blur(8px)" });
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        ease: "power3.out",
        duration: 0.8,
        stagger: 0.12,
        delay: 0.1,
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(items, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
    });

    return () => mm.revert();
  }, [rootRef]);
}
