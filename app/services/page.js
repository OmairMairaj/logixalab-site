import Footer from "@/app/components/Footer";
import ContactSection from "@/app/sections/ContactSection";
import ServicesHero from "@/app/services/ServicesHero";
import ServicesListSection from "@/app/services/ServicesListSection";
import ServicesPageBackdrop from "@/app/services/ServicesPageBackdrop";

export const metadata = {
  title: "Services — Logixa Lab",
  description:
    "AI solutions designed to scale your business. Engineering, design, and intelligent systems from Logixa Lab.",
};

export default function ServicesPage() {
  return (
    <main className="relative overflow-x-hidden text-white">
      <ServicesPageBackdrop />
      <div className="relative z-10">
        <ServicesHero />
        <ServicesListSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
