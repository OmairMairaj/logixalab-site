import Image from "next/image";

/**
 * Shared fixed backdrop for /work — mirrors `ServicesPageBackdrop`: one cohesive
 * #0c0c0c canvas (same as the home sections) with a faint binary accent in the
 * top-right and a top/bottom vignette that seats the content. The hero + project
 * showcase scroll over it, so there's no hard seam — the page reads as one canvas.
 */
export default function WorkPageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-(--section-canvas)" aria-hidden>
      {/* Faint binary texture, top-right. */}
      <div className="absolute right-0 top-0 hidden h-[60vh] w-[min(60vw,800px)] opacity-[0.9] md:block">
        <Image
          src="/images/binary.png"
          alt=""
          fill
          className="object-contain object-right-top"
          sizes="60vw"
        />
      </div>

      {/* Top + bottom vignette — darkens the hero crown toward black and seats
          the lower content over the section canvas. */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/65" />
    </div>
  );
}
