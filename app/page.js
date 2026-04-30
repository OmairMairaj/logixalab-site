import LandingScrollExperience from "@/app/sections/LandingScrollExperience";
import ContactSection from "@/app/sections/ContactSection";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <LandingScrollExperience />
      <ContactSection />
      <Footer />
    </main>
  );
}
