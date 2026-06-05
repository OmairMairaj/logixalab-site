import Footer from "@/app/components/Footer";
import ContactSection from "@/app/sections/ContactSection";
import ServicesHero from "@/app/services/ServicesHero";
import ServicesShowcase from "@/app/services/ServicesShowcase";
import ServicesPageBackdrop from "@/app/services/ServicesPageBackdrop";

export const metadata = {
  title: "Services — Logixa Lab",
  description:
    "AI solutions designed to scale your business. Enterprise platforms, AI & automation, mobile, design, cloud, and data — engineered in-house by Logixa Lab.",
};

export default function ServicesPage() {
  return (
    <>
      <main className="relative overflow-x-clip text-white">
        <ServicesPageBackdrop />
        <div className="relative z-10">
          <ServicesHero />
          <ServicesShowcase />
          <ContactSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
