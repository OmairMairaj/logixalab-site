import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0c0c0c]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover opacity-50"
          priority
        />
      </div>

      {/* Green glow orbs */}
      <div className="pointer-events-none absolute right-[18%] top-[10%] h-[600px] w-[600px] rounded-full bg-[#aaff00]/15 blur-[140px]" />
      <div className="pointer-events-none absolute right-[28%] top-[22%] h-[280px] w-[280px] rounded-full bg-[#aaff00]/28 blur-[70px]" />

      {/* 3D logo mark — sits between bg and heading text */}
      <div className="absolute inset-y-0 right-[-4%] top-[8%] z-10 w-[58%]">
        <Image
          src="/images/hero-logo3d.png"
          alt="LogixaLab 3D mark"
          fill
          className="object-contain object-center"
          priority
        />
      </div>

      {/* Top-left copy */}
      <div className="relative z-30 px-8 pt-44 md:px-12 lg:px-16">
        <div className="max-w-[280px]">
          <p className="mb-4 text-sm leading-6 text-white/85">
            We approach design through logic, systems,
            <br />
            and human emotion.
          </p>
          <p className="mb-6 text-sm leading-6 text-white/50">
            Every detail we craft carries clarity, intention, and quiet
            confidence. That&apos;s how we design and build websites that work
            — and feel right.
          </p>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#aaff00] transition-opacity hover:opacity-70"
          >
            <svg width="16" height="12" viewBox="0 0 24 18" fill="none">
              <polyline
                points="1,1 6,16 12,4 18,16 23,1"
                stroke="#aaff00"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            Start a New Project
          </Link>
        </div>
      </div>

      {/* Large bottom heading */}
      <div className="absolute bottom-0 left-0 z-20 select-none">
        <h1 className="whitespace-nowrap font-sans font-bold leading-[0.9] tracking-tight text-white">
          <span className="block pl-3 text-[11vw] md:pl-6">
            Engineering
          </span>
          <span className="block pl-[37vw] text-[11vw]">Intelligence</span>
        </h1>
      </div>
    </section>
  );
}
