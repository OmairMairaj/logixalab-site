import HeroSection from "@/app/sections/HeroSection";
import IntroSection from "@/app/sections/IntroSection";
import CoreCapabilitiesSection from "@/app/sections/CoreCapabilitiesSection";
import ContactSection from "@/app/sections/ContactSection";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <HeroSection />
      <IntroSection />
      <CoreCapabilitiesSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
