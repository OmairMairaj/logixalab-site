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
      <main className="relative overflow-x-clip bg-(--hero-canvas) text-white">
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
