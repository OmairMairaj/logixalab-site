import PageBackdrop from "@/app/components/PageBackdrop";
import WorkHero from "@/app/work/WorkHero";
import WorkProjectShowcase from "@/app/work/WorkProjectShowcase";

export const metadata = {
  title: "Work",
  description:
    "Portfolio of engineering, design, and intelligent systems from Logixa Lab.",
};

export default function WorkPage() {
  return (
    // Shared #0c0c0c canvas (same pattern as /services): hero + showcase scroll
    // over one fixed backdrop. The footer rises over the last pinned project at
    // the end of the showcase (rendered inside WorkProjectShowcase).
    <main className="relative overflow-x-clip text-white">
      <PageBackdrop />
      <div className="relative z-10">
        <WorkHero />
        <WorkProjectShowcase />
      </div>
    </main>
  );
}
