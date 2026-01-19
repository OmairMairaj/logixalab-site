import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | JUTE Fashion",
  description: "Get in touch with JUTE Fashion. Have questions about our platform, customization, or creator rewards? Contact our support team.",
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contact Us"
        description="Have questions about JUTE Fashion? Want to learn more about our creator-first customization platform? Get in touch with us and we'll get back to you as soon as possible."
      />

      <Contact />
    </>
  );
};

export default ContactPage;
