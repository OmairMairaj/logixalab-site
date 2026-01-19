import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | JUTE Fashion",
  description: "Learn about JUTE Fashion - a creator-first women's apparel customization platform for Gen Z women in Pakistan. Discover our vision, mission, and how we're revolutionizing fashion customization.",
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Us"
        description="JUTE Fashion is a creator-first women's apparel customization platform where Gen Z women in Pakistan can design their own Kurta Shalwar step-by-step, publish designs to a public gallery, and earn rewards."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;