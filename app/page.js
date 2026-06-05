import HeroSection from "@/app/sections/HeroSection";
import IntroSection from "@/app/sections/IntroSection";
import CoreCapabilitiesSection from "@/app/sections/CoreCapabilitiesSection";
import ToolsSection from "@/app/sections/ToolsSection";
import DeliveryFrameworkSection from "@/app/sections/DeliveryFrameworkSection";
import GlobalExperienceSection from "@/app/sections/GlobalExperienceSection";
import ContactSection from "@/app/sections/ContactSection";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <HeroSection />
      <IntroSection />
      <CoreCapabilitiesSection />
      <ToolsSection />
      <DeliveryFrameworkSection />
      <GlobalExperienceSection />
      <ContactSection endZone />
    </main>
  );
}
