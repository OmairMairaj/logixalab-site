/** Services hero — static markup; background lives on `ServicesPageBackdrop` (single fixed layer). */

export default function ServicesHero() {
  return (
    <section
      className="relative min-h-dvh overflow-x-clip bg-transparent pt-16 text-white md:pt-20"
      aria-labelledby="services-hero-heading"
    >
      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[min(100%,1440px)] flex-col px-5 pb-12 pt-6 md:px-10 md:pb-16 md:pt-10">
        <div className="flex flex-1 flex-col justify-center py-8 md:py-12">
          <h1
            id="services-hero-heading"
            className="max-w-[min(100%,22rem)] font-heading font-normal tracking-[-0.03em] md:max-w-none"
          >
            <span className="block bg-linear-to-b from-neutral-100 via-white to-neutral-400 bg-clip-text text-transparent text-[clamp(2.75rem,10.5vw,6.25rem)] leading-[1.02]">
              AI Solutions
            </span>
            <span className="mt-3 block bg-linear-to-b from-neutral-200 via-neutral-100 to-neutral-500 bg-clip-text text-transparent text-[clamp(1.35rem,4.2vw,2.75rem)] leading-[1.12] md:mt-4">
              <span className="block">Designed to Scale</span>
              <span className="block">Your Business</span>
            </span>
          </h1>
        </div>

        <p className="ml-auto mt-auto max-w-[min(100%,22rem)] text-pretty text-right text-[0.8125rem] leading-relaxed text-white/88 md:max-w-md md:text-[0.9375rem]">
          At LOGIXA LAB, we are a collective of engineers, designers, and AI specialists united by one
          mission — to build intelligent systems that shape the future of business.
        </p>
      </div>
    </section>
  );
}
