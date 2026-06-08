import Image from "next/image";

/**
 * Shared fixed page backdrop — one cohesive #0c0c0c canvas (matching the home
 * sections) with a faint binary accent in the top-right and a top/bottom
 * vignette that seats the content. Page content scrolls over it at z-0, so each
 * route reads as one continuous canvas. Used by /work, /services, /contact, /team.
 */
export default function PageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-(--section-canvas)" aria-hidden>
      {/* Faint binary texture, top-right (desktop only). */}
      <div className="absolute right-0 top-0 hidden h-[60vh] w-[min(60vw,800px)] opacity-[0.9] md:block">
        <Image
          src="/images/binary.webp"
          alt=""
          fill
          className="object-contain object-right-top"
          sizes="60vw"
        />
      </div>

      {/* Top + bottom vignette — seats the content over the canvas. */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/65" />
    </div>
  );
}
