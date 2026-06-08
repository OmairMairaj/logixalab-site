import PageBackdrop from "@/app/components/PageBackdrop";
import TeamScrollExperience from "@/app/sections/TeamScrollExperience";

export const metadata = {
  title: "Team",
  description:
    "Meet the engineers, designers and AI specialists behind Logixa Lab.",
};

export default function TeamPage() {
  return (
    // Same shell as /work, /services, /contact: hero + content scroll over one
    // fixed backdrop. The footer rises over the pinned team frame at the end of
    // the scroll experience (rendered inside TeamScrollExperience).
    <main className="relative overflow-x-clip text-white">
      <PageBackdrop />
      <div className="relative z-10">
        <TeamScrollExperience />
      </div>
    </main>
  );
}
