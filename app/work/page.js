import Footer from "@/app/components/Footer";
import WorkHero from "@/app/work/WorkHero";
import WorkPageBackdrop from "@/app/work/WorkPageBackdrop";
import WorkProjectShowcase from "@/app/work/WorkProjectShowcase";

export const metadata = {
  title: "Work — Logixa Lab",
  description:
    "Portfolio of engineering, design, and intelligent systems from Logixa Lab.",
};

export default function WorkPage() {
  return (
    <>
      {/* Shared #0c0c0c canvas (same pattern as /services): hero + showcase
          scroll over one fixed backdrop with binary accent + vignette. */}
      <main className="relative overflow-x-clip text-white">
        <WorkPageBackdrop />
        <div className="relative z-10">
          <WorkHero />
          <WorkProjectShowcase />
        </div>
      </main>
      <Footer />
    </>
  );
}
