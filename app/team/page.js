import TeamScrollExperience from "@/app/sections/TeamScrollExperience";
import ContactSection from "@/app/sections/ContactSection";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Team — Logixa Lab",
  description:
    "Meet the engineers, designers and AI specialists behind Logixa Lab.",
};

export default function TeamPage() {
  return (
    <main className="overflow-x-hidden">
      <TeamScrollExperience />
      <ContactSection />
      <Footer />
    </main>
  );
}
