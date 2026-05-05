/**
 * Portfolio case studies — consumed by `WorkProjectShowcase` (single scroll sequence).
 * Swap `image` / `visitHref` for production.
 */
export const WORK_PROJECTS = [
  {
    id: "shopbreeze",
    title: "ShopBreeze",
    paragraphs: [
      "We partnered with ShopBreeze to design a modern, user-focused commerce experience that puts products and clarity first — from first visit to checkout.",
      "The result is a faster, more confident shopping flow and a stronger brand presence across devices.",
    ],
    visitLabel: "Visit Site",
    visitHref: "https://example.com",
    image: "/images/0acf53fbb08115533875daf9754295cb7c7746e8.png",
    imageAlt: "ShopBreeze storefront preview",
    tech: ["Shopify / Custom Frontend", "HTML, CSS, JavaScript", "Responsive design frameworks"],
    timeline: "2–4 weeks",
  },
  {
    id: "nexusflow",
    title: "NexusFlow",
    paragraphs: [
      "NexusFlow needed an operator-grade dashboard for monitoring AI pipelines — dense data, zero clutter, and instant drill-down.",
      "We shipped a dark-first UI with real-time charts, role-aware layouts, and keyboard-first workflows for power users.",
    ],
    visitLabel: "View product",
    visitHref: "https://example.com",
    image: "/images/contact-page-bg.jpg",
    imageAlt: "NexusFlow analytics dashboard",
    tech: ["React / Next.js", "WebSockets", "D3-style charting", "Design system"],
    timeline: "6–8 weeks",
  },
  {
    id: "pulsehealth",
    title: "PulseHealth",
    paragraphs: [
      "PulseHealth connects patients and clinicians through a calm, trustworthy portal — accessibility and clarity were non-negotiable.",
      "We refined IA, built a WCAG-conscious component library, and tuned performance for low-bandwidth environments.",
    ],
    visitLabel: "Visit Site",
    visitHref: "https://example.com",
    image: "/images/default-contact-section-bg.jpg",
    imageAlt: "PulseHealth patient portal",
    tech: ["Next.js", "Tailwind CSS", "HIPAA-minded patterns", "i18n"],
    timeline: "10–12 weeks",
  },
  {
    id: "atlascrm",
    title: "AtlasCRM",
    paragraphs: [
      "AtlasCRM sells to enterprise teams — the product had to feel fast, familiar, and configurable without training.",
      "We introduced a modular shell, saved-view presets, and inline editing patterns that cut time-to-first-value.",
    ],
    visitLabel: "Case study",
    visitHref: "https://example.com",
    image: "/images/0acf53fbb08115533875daf9754295cb7c7746e8.png",
    imageAlt: "AtlasCRM pipeline view",
    tech: ["Vue / Nuxt", "REST + GraphQL", "RBAC UI", "Storybook"],
    timeline: "8 weeks",
  },
  {
    id: "voltpay",
    title: "VoltPay",
    paragraphs: [
      "VoltPay’s checkout had to feel instant and bulletproof — fraud signals, retries, and receipts surfaced without overwhelming shoppers.",
      "We redesigned the payment funnel, tightened error states, and aligned motion with trust-building micro-interactions.",
    ],
    visitLabel: "Visit Site",
    visitHref: "https://example.com",
    image: "/images/contact-page-bg.jpg",
    imageAlt: "VoltPay checkout experience",
    tech: ["Stripe integrations", "Edge middleware", "React Native Web", "Observability hooks"],
    timeline: "4–6 weeks",
  },
];
