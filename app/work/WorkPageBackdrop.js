import Image from "next/image";

/** Fixed backdrop for /work — same image stack as home hero (`LandingScrollExperience`). */
export default function WorkPageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div className="absolute inset-0">
        <Image
          src="/images/Background.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute left-0 top-0 h-full w-[56vw] -translate-x-1/4 translate-y-[30%]">
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
    </div>
  );
}
