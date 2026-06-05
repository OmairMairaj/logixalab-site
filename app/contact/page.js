import ContactPageClient from "@/app/contact/ContactPageClient";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Logixa Lab. Email, phone, and project inquiry form.",
};

export default function ContactPage() {
  return (
    <main className="overflow-x-hidden">
      <ContactPageClient />
      <Footer />
    </main>
  );
}
