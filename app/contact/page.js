import PageBackdrop from "@/app/components/PageBackdrop";
import ContactHero from "@/app/contact/ContactHero";
import ContactFormCard from "@/app/sections/ContactFormCard";
import FooterReveal from "@/app/components/FooterReveal";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Logixa Lab. Email, phone, and project inquiry form.",
};

export default function ContactPage() {
  return (
    <main className="relative overflow-x-clip text-white">
      {/* Shared #0c0c0c canvas (same pattern as /services and /work). */}
      <PageBackdrop />
      <div className="relative z-10">
        <ContactHero />

        {/* Hero → form transition + footer rise: the form card reveals as the
            stage pins, then the footer slides up over it (homepage end-zone
            pattern, standalone). FooterReveal renders the footer itself. */}
        <FooterReveal stageClassName="max-w-[clamp(20rem,34vw,30rem)]">
          <div className="relative w-full">
            <div
              data-fr-glass
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl backdrop-saturate-150 will-change-[opacity]"
              aria-hidden
            />
            <div
              data-fr-content
              className="relative z-10 px-6 py-7 will-change-[opacity] sm:px-8 sm:py-9"
            >
              <ContactFormCard />
            </div>
          </div>
        </FooterReveal>
      </div>
    </main>
  );
}
