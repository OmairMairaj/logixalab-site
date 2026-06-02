import Image from "next/image";

/** One shared fixed backdrop for /services — content scrolls over it (no per-section bg repeat). */
export default function ServicesPageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div className="absolute inset-0">
        <Image
          src="/images/background.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute left-0 top-0 h-full w-[56vw] -translate-x-1/3">
          <Image
            src="/images/left.png"
            alt=""
            fill
            className="object-contain object-left"
            sizes="65vw"
          />
        </div>
        <div className="absolute right-0 top-0 z-10 h-[92vh] w-[66vw] translate-x-[30%] -translate-y-[24%]">
          <Image
            src="/images/right.png"
            alt=""
            fill
            className="object-contain object-top-right"
            sizes="66vw"
          />
        </div>
      </div>
      <div
        className="absolute inset-0 z-20 bg-linear-to-b from-black/35 via-black/15 to-black/45"
        aria-hidden
      />
    </div>
  );
}
