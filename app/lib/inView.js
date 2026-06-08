/* Tiny IntersectionObserver helper: invokes onChange(visible) whenever `el`
   enters or leaves the viewport. Returns a cleanup function.

   Used to PAUSE per-frame work (rAF physics loops, the tools marquee, the touch
   scan-zone) for sections that are scrolled out of view — on low-end mobile,
   loops that keep ticking offscreen are a big, avoidable CPU/GPU drain. */
export function observeInView(el, onChange, options = {}) {
  const { rootMargin = "200px", threshold = 0 } = options;

  // No IO support (or no element) → assume visible so nothing silently breaks.
  if (typeof IntersectionObserver === "undefined" || !el) {
    onChange(true);
    return () => {};
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) onChange(entry.isIntersecting);
    },
    { rootMargin, threshold },
  );
  io.observe(el);
  return () => io.disconnect();
}
