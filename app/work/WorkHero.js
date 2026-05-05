/** Portfolio hero — chrome “Portfolio” title, subtitle, mission line (matches work page comp). */

export default function WorkHero() {
  return (
    <section
      className="relative min-h-dvh overflow-x-clip bg-transparent pt-16 text-white md:pt-20"
      aria-labelledby="work-hero-heading"
    >
      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[min(100%,1440px)] flex-col px-5 pb-12 pt-6 md:px-10 md:pb-16 md:pt-10">
        <div className="flex flex-1 flex-col justify-center py-8 md:py-12">
          <h1 id="work-hero-heading" className="max-w-[min(100%,56rem)] font-heading font-normal">
            <span className="block bg-linear-to-b from-neutral-100 via-white to-neutral-500 bg-clip-text text-transparent text-[clamp(2.5rem,12vw,7rem)] leading-[1.02] tracking-[0.08em] md:tracking-[0.12em]">
              Portfolio
            </span>
            <span className="mt-2 block font-sans text-[clamp(1rem,3.2vw,1.65rem)] font-light leading-snug tracking-[0.02em] text-white md:mt-3">
              That Speaks Itself
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
