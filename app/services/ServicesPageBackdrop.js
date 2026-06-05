import Image from "next/image";

/**
 * Shared fixed backdrop for /services and /services/[slug] — a cohesive dark
 * canvas (matches the homepage sections) with a soft lime glow and a faint
 * binary accent. Content scrolls over it; no per-section background repeat.
 */
export default function ServicesPageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-(--section-canvas)" aria-hidden>
      {/* faint binary texture, top-right */}
      <div className="absolute right-0 top-0 hidden h-[60vh] w-[min(60vw,800px)] opacity-[0.9] md:block">
        <Image src="/images/binary.png" alt="" fill className="object-contain object-right-top" sizes="60vw" />
      </div>

      {/* soft lime glow anchored bottom-center */}
      <div className="absolute inset-x-0 bottom-[-10vh] mx-auto h-[80vh] w-full opacity-50">
        {/* <Image src="/images/wide-blur.png" alt="" fill className="object-contain object-bottom" sizes="100vw" /> */}
      </div>

      {/* top + bottom vignette to seat the content */}
      <div className="absolute inset-0 bg-linear-to-b from-black/55 via-transparent to-black/65" />
    </div>
  );
}
