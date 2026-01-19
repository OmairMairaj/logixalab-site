import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | JUTE Fashion",
  description: "JUTE Fashion Privacy Policy - Learn how we collect, use, and protect your personal information when you use our platform.",
};

const PrivacyPolicyPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Privacy Policy"
        description="Your privacy is important to us. This policy explains how JUTE Fashion collects, uses, and protects your information."
      />
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 rounded-xs bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:px-8 xl:p-[55px]">
              <h1 className="mb-6 text-3xl font-bold text-black dark:text-white sm:text-4xl">
                Privacy Policy
              </h1>
              <p className="mb-8 text-base text-body-color dark:text-body-color-dark">
                Last updated: January 2025
              </p>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
                  1. Introduction
                </h2>
                <p className="mb-6 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  Welcome to JUTE Fashion ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>

                <h2 className="mb-4 mt-8 text-2xl font-bold text-black dark:text-white">
                  2. Information We Collect
                </h2>
                <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">
                  2.1 Personal Information
                </h3>
                <p className="mb-4 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  We may collect personal information that you provide directly to us, including:
                </p>
                <ul className="mb-6 ml-6 list-disc space-y-2 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Profile information and preferences</li>
                  <li>Payment and billing information</li>
                  <li>Design preferences and customization data</li>
                  <li>Communications with our support team</li>
                </ul>

                <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">
                  2.2 Usage Information
                </h3>
                <p className="mb-6 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  We automatically collect certain information about your device and how you interact with our platform, including:
                </p>
                <ul className="mb-6 ml-6 list-disc space-y-2 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, features used)</li>
                  <li>Design activity and preferences</li>
                  <li>Gallery interactions (likes, shares, views)</li>
                </ul>

                <h2 className="mb-4 mt-8 text-2xl font-bold text-black dark:text-white">
                  3. How We Use Your Information
                </h2>
                <p className="mb-4 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  We use the information we collect to:
                </p>
                <ul className="mb-6 ml-6 list-disc space-y-2 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your orders and manage your account</li>
                  <li>Enable design customization and gallery features</li>
                  <li>Calculate and manage creator rewards</li>
                  <li>Send you updates, newsletters, and promotional communications (with your consent)</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Detect, prevent, and address technical issues and security threats</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2 className="mb-4 mt-8 text-2xl font-bold text-black dark:text-white">
                  4. Information Sharing and Disclosure
                </h2>
                <p className="mb-4 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  We do not sell your personal information. We may share your information only in the following circumstances:
                </p>
                <ul className="mb-6 ml-6 list-disc space-y-2 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (payment processing, shipping, analytics)</li>
                  <li><strong>Public Gallery:</strong> Designs you publish to our gallery are publicly visible, including your creator name and design details</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                </ul>

                <h2 className="mb-4 mt-8 text-2xl font-bold text-black dark:text-white">
                  5. Data Security
                </h2>
                <p className="mb-6 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>

                <h2 className="mb-4 mt-8 text-2xl font-bold text-black dark:text-white">
                  6. Your Rights and Choices
                </h2>
                <p className="mb-4 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  You have the right to:
                </p>
                <ul className="mb-6 ml-6 list-disc space-y-2 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and personal data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Control visibility of your published designs</li>
                  <li>Request a copy of your data</li>
                </ul>

                <h2 className="mb-4 mt-8 text-2xl font-bold text-black dark:text-white">
                  7. Cookies and Tracking Technologies
                </h2>
                <p className="mb-6 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookie preferences through your browser settings.
                </p>

                <h2 className="mb-4 mt-8 text-2xl font-bold text-black dark:text-white">
                  8. Children's Privacy
                </h2>
                <p className="mb-6 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  Our platform is intended for users aged 13 and older. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                </p>

                <h2 className="mb-4 mt-8 text-2xl font-bold text-black dark:text-white">
                  9. Changes to This Policy
                </h2>
                <p className="mb-6 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our platform after changes become effective constitutes acceptance of the updated policy.
                </p>

                <h2 className="mb-4 mt-8 text-2xl font-bold text-black dark:text-white">
                  10. Contact Us
                </h2>
                <p className="mb-6 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mb-6 rounded-xs bg-gray-light p-6 dark:bg-gray-dark">
                  <p className="mb-2 text-base font-semibold text-black dark:text-white">
                    JUTE Fashion
                  </p>
                  <p className="mb-1 text-base text-body-color dark:text-body-color-dark">
                    Email: privacy@jutefashion.com
                  </p>
                  <p className="text-base text-body-color dark:text-body-color-dark">
                    Visit our <a href="/contact" className="text-primary hover:underline">Contact Page</a> for more ways to reach us.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;
