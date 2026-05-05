import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/app/components/Footer";
import ServicesPageBackdrop from "@/app/services/ServicesPageBackdrop";
import { SERVICES } from "@/app/services/servicesData";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return { title: "Service — Logixa Lab" };
  return {
    title: `${service.title} — Services — Logixa Lab`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
      <main className="relative overflow-x-hidden text-white">
        <ServicesPageBackdrop />
        <div className="relative z-10">
          <article className="mx-auto max-w-[min(100%,720px)] px-5 pb-20 pt-28 md:px-10 md:pt-32 md:pb-28">
            <p className="font-heading text-sm tabular-nums text-white/40">{service.index}</p>
            <h1 className="mt-2 font-heading text-[clamp(1.75rem,5vw,2.75rem)] font-semibold leading-tight tracking-tight text-white">
              {service.title}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-white/75 md:text-[1.05rem]">
              {service.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex rounded-full bg-(--hero-accent) px-6 py-2.5 text-sm font-semibold text-(--hero-canvas) transition-opacity hover:opacity-90"
              >
                Start a project
              </Link>
              <Link
                href="/services"
                className="inline-flex rounded-full border border-white/25 px-6 py-2.5 text-sm font-medium text-white/90 transition-colors hover:border-white/45 hover:text-white"
              >
                All services
              </Link>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
