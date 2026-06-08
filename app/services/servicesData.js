/**
 * Shared services data — powers the /services index (sticky stacked panels) and
 * the /services/[slug] detail routes. Aligned to the homepage "Our Core
 * Capabilities" set, enriched with focused, professional content.
 */
export const SERVICES = [
  {
    slug: "enterprise-platform-engineering",
    index: "01",
    title: "Enterprise Platform Engineering",
    tagline: "The platforms your business runs on — built to scale for years, not quarters.",
    overview: [
      "We design and engineer the core systems your business depends on — ERPs, CRMs, customer portals, and multi-tenant SaaS platforms — with architecture that holds up as your users, data, and teams multiply.",
      "Every platform is built in-house by one integrated team, with security, observability, and maintainability designed in from day one, so you're never boxed in by technical debt.",
    ],
    image: "/images/capabilities/cap-enterprise.webp",
    highlights: ["Multi-tenant by design", "Enterprise-grade security", "Engineered for long-term growth"],
    capabilities: [
      { title: "Multi-tenant SaaS", desc: "Isolated, scalable tenancy with per-customer data, billing, and configuration." },
      { title: "ERP & CRM systems", desc: "Operational backbones that fit your real workflows — not the other way around." },
      { title: "Customer & partner portals", desc: "Secure self-service experiences with role-based access and rich dashboards." },
      { title: "Auth, RBAC & SSO", desc: "Granular permissions, SSO/SAML, and audit trails built to enterprise standards." },
      { title: "Integrations & APIs", desc: "Clean REST/GraphQL APIs and resilient third-party integrations." },
      { title: "Scale & reliability", desc: "Caching, queues, and horizontal scaling tuned for high-load production." },
    ],
    tech: ["Next.js", "Node.js", "TypeScript", "PostgreSQL", "Redis", "GraphQL", "Docker"],
  },
  {
    slug: "ai-automation-engineering",
    index: "02",
    title: "AI & Automation Engineering",
    tagline: "Production AI that ships — agents, assistants, and automation that run your work.",
    overview: [
      "We build AI into the places it earns its keep: LLM-powered assistants, retrieval systems over your own data, and automation pipelines that take repetitive work off your team's plate.",
      "From prompt and retrieval design to evaluation, guardrails, and monitoring, we engineer AI for the realities of production — accuracy, cost, latency, and trust.",
    ],
    image: "/images/capabilities/cap-ai-automation.webp",
    highlights: ["Grounded in your data", "Built for production", "Measured, safe, monitored"],
    capabilities: [
      { title: "LLM & conversational AI", desc: "Assistants and copilots grounded in your domain and tone of voice." },
      { title: "RAG systems", desc: "Retrieval over your documents and data with citations and guardrails." },
      { title: "Intelligent automation", desc: "Agents and workflows that act across your tools, end to end." },
      { title: "Workflow orchestration", desc: "Multi-step pipelines with retries, evals, and human-in-the-loop." },
      { title: "Model integration & ops", desc: "OpenAI, Anthropic, Gemini, and open models wired in safely." },
      { title: "Evaluation & guardrails", desc: "Test harnesses, safety filters, and monitoring you can trust." },
    ],
    tech: ["OpenAI", "Anthropic", "Python", "LangChain", "Pinecone", "FastAPI", "Vercel AI SDK"],
  },
  {
    slug: "mobile-app-development",
    index: "03",
    title: "Mobile App Development",
    tagline: "iOS and Android apps that feel native, ship fast, and scale cleanly.",
    overview: [
      "We craft cross-platform and native mobile apps with the polish users expect and the architecture your roadmap needs — fluid interfaces, offline-first data, and seamless integration with your backend.",
      "One team owns the whole stack, so your app, APIs, and infrastructure move together from prototype to store release and beyond.",
    ],
    image: "/images/capabilities/cap-mobile.webp",
    highlights: ["Native feel, faster ship", "Offline-first data", "One team, full stack"],
    capabilities: [
      { title: "Cross-platform apps", desc: "One codebase for iOS and Android with native-grade performance." },
      { title: "Native development", desc: "Swift and Kotlin where the platform truly demands it." },
      { title: "Offline-first & sync", desc: "Reliable local data with seamless background synchronization." },
      { title: "Backend integration", desc: "Secure APIs, real-time data, and push notifications." },
      { title: "App store delivery", desc: "CI/CD, beta pipelines, and smooth store releases." },
      { title: "Scalable architecture", desc: "Modular, testable code that grows with the product." },
    ],
    tech: ["React Native", "Expo", "Swift", "Kotlin", "Firebase", "GraphQL"],
  },
  {
    slug: "uiux-creative-engineering",
    index: "04",
    title: "UI/UX & Creative Engineering",
    tagline: "Interfaces that convert — research-led design brought to life with motion.",
    overview: [
      "We pair product research with design-systems thinking and creative engineering to turn complex capabilities into interfaces that feel effortless and on-brand.",
      "From prototypes to motion design to production-ready components, we make sure what's designed is exactly what ships.",
    ],
    image: "/images/capabilities/cap-uiux.webp",
    highlights: ["Research to pixels", "Design-system driven", "Motion with purpose"],
    capabilities: [
      { title: "Product & UX research", desc: "Flows, wireframes, and testing that de-risk decisions early." },
      { title: "Design systems", desc: "Reusable, accessible component libraries tied directly to code." },
      { title: "Conversion-focused UI", desc: "Interfaces designed around the actions that matter most." },
      { title: "Motion & interaction", desc: "Purposeful animation that guides, explains, and delights." },
      { title: "Branding & identity", desc: "Cohesive visual systems across every product surface." },
      { title: "Immersive experiences", desc: "WebGL, scroll, and 3D for standout, memorable moments." },
    ],
    tech: ["Figma", "Tailwind CSS", "GSAP", "Framer Motion", "Three.js"],
  },
  {
    slug: "cloud-infrastructure-reliability",
    index: "05",
    title: "Cloud Infrastructure & Reliability",
    tagline: "Infrastructure that stays up, scales out, and deploys without drama.",
    overview: [
      "We build the cloud foundation your product depends on — infrastructure as code, automated delivery, and deep observability — so releases are routine and uptime is a given.",
      "Whether AWS, Azure, GCP, or hybrid, we engineer for resilience, security, and cost-efficiency at enterprise scale.",
    ],
    image: "/images/capabilities/cap-cloud.webp",
    highlights: ["Deploy without drama", "Self-healing scale", "Enterprise-grade uptime"],
    capabilities: [
      { title: "Infrastructure as code", desc: "Reproducible environments with Terraform and pipelines." },
      { title: "CI/CD automation", desc: "Safe, fast, automated deployments with instant rollbacks." },
      { title: "Kubernetes & containers", desc: "Orchestrated, self-healing, horizontally scalable workloads." },
      { title: "Observability", desc: "Metrics, logs, traces, and alerting you can actually act on." },
      { title: "Resilience & DR", desc: "High availability, backups, and tested disaster recovery." },
      { title: "Cost & security", desc: "Right-sized, hardened, and continuously monitored." },
    ],
    tech: ["AWS", "Azure", "Kubernetes", "Terraform", "Docker", "GitHub Actions", "Grafana"],
  },
  {
    slug: "data-science-bi",
    index: "06",
    title: "Data Science & Business Intelligence",
    tagline: "Turn your data into decisions — analytics, ML, and dashboards that move the needle.",
    overview: [
      "We help you see and act on what your data is telling you — from predictive models to live operational dashboards that put the right numbers in front of the right people.",
      "We own the full lifecycle: pipelines, feature stores, model training and deployment, and the BI layer your teams use every day.",
    ],
    image: "/images/capabilities/cap-data-science.webp",
    highlights: ["Data to decisions", "Full ML lifecycle", "Dashboards people use"],
    capabilities: [
      { title: "Predictive analytics", desc: "Forecasting and models that inform real business decisions." },
      { title: "ML engineering", desc: "Training, evaluation, and deployment done the right way." },
      { title: "Data pipelines", desc: "Reliable ELT/ETL and feature stores built to scale." },
      { title: "Operational dashboards", desc: "Live business intelligence your teams actually use." },
      { title: "Experimentation", desc: "A/B testing and metrics frameworks you can trust." },
      { title: "Data governance", desc: "Quality, lineage, and access kept firmly under control." },
    ],
    tech: ["Python", "dbt", "Snowflake", "Airflow", "PyTorch", "Power BI", "Metabase"],
  },
];

/** Helpers for the detail routes. */
export function getService(slug) {
  return SERVICES.find((s) => s.slug === slug);
}

export function getAdjacentServices(slug) {
  const i = SERVICES.findIndex((s) => s.slug === slug);
  if (i === -1) return { prev: null, next: null };
  const prev = SERVICES[(i - 1 + SERVICES.length) % SERVICES.length];
  const next = SERVICES[(i + 1) % SERVICES.length];
  return { prev, next };
}
