import PageBackdrop from "@/app/components/PageBackdrop";
import ServicesHero from "@/app/services/ServicesHero";
import ServicesShowcase from "@/app/services/ServicesShowcase";

export const metadata = {
  title: "Services",
  description:
    "AI solutions designed to scale your business. Enterprise platforms, AI & automation, mobile, design, cloud, and data — engineered in-house by Logixa Lab.",
};

export default function ServicesPage() {
  return (
    // Hero + showcase scroll over one fixed backdrop. The footer rises over the
    // last pinned service card at the end (rendered inside ServicesShowcase).
    <main className="relative overflow-x-clip text-white">
      <PageBackdrop />
      <div className="relative z-10">
        <ServicesHero />
        <ServicesShowcase />
      </div>
    </main>
  );
}
