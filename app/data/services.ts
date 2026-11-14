/**
 * KaryaByte — Services & Delivery Pipeline Data
 */

export type Service = {
  id: string;
  icon: string; // emoji or icon key
  title: string;
  titleId: string; // Bahasa Indonesia
  description: string;
  tags: string[];
};

export const services: Service[] = [
  {
    id: "systems-architecture",
    icon: "⬡",
    title: "System Architecture & Engineering",
    titleId: "Arsitektur Sistem & Rekayasa",
    description:
      "We design distributed systems that scale gracefully — from API contracts and database schemas to microservice boundaries and cloud deployment topology.",
    tags: ["Backend", "API Design", "Database", "Cloud", "DevOps"],
  },
  {
    id: "fullstack-development",
    icon: "◈",
    title: "Fullstack Product Development",
    titleId: "Pengembangan Produk Fullstack",
    description:
      "End-to-end implementation with Next.js, TypeScript, and modern tooling. We own the entire delivery — no handoffs, no context loss, no agency overhead.",
    tags: ["Next.js", "TypeScript", "React", "Node.js", "PostgreSQL"],
  },
  {
    id: "ui-ux-design",
    icon: "◎",
    title: "UI/UX Design & Design Systems",
    titleId: "Desain UI/UX & Sistem Desain",
    description:
      "Craft-level visual design backed by rigorous UX thinking. We build design systems that scale across product surfaces and reduce long-term engineering overhead.",
    tags: ["Figma", "Design Systems", "Prototyping", "UX Research"],
  },
  {
    id: "product-management",
    icon: "◬",
    title: "Agile Product Management",
    titleId: "Manajemen Produk Agile",
    description:
      "Sprint planning, stakeholder alignment, and clear delivery roadmaps. We act as embedded product managers, keeping scope tight and momentum high.",
    tags: ["Agile", "Sprint Planning", "Roadmapping", "Stakeholder Mgmt"],
  },
];

export type DeliveryPhase = {
  number: string;
  title: string;
  titleId: string;
  description: string;
  deliverables: string[];
  owner: "systems" | "design" | "both";
};

export const deliveryPipeline: DeliveryPhase[] = [
  {
    number: "01",
    title: "Discovery & System Blueprint",
    titleId: "Penemuan & Cetak Biru Sistem",
    description:
      "Deep-dive into your domain, users, and technical constraints. We emerge with a system architecture document, data model, and validated product brief.",
    deliverables: [
      "System Architecture Diagram",
      "Data Model & ERD",
      "Technical Feasibility Report",
      "Product Brief & Success Metrics",
    ],
    owner: "both",
  },
  {
    number: "02",
    title: "UI/UX Prototyping",
    titleId: "Prototipe UI/UX",
    description:
      "High-fidelity interactive prototypes that validate user flows before a single line of production code is written. Fast iteration, real user feedback.",
    deliverables: [
      "Wireframes & User Flow Maps",
      "High-Fidelity Figma Prototype",
      "Design System (Components + Tokens)",
      "Usability Test Report",
    ],
    owner: "design",
  },
  {
    number: "03",
    title: "Fullstack Engineering",
    titleId: "Rekayasa Fullstack",
    description:
      "Production-grade implementation. We build with performance, security, and maintainability baked in — not bolted on. CI/CD, test coverage, monitoring included.",
    deliverables: [
      "Frontend (Next.js / React)",
      "Backend APIs & Integrations",
      "Database Implementation",
      "CI/CD Pipeline & Infra Config",
    ],
    owner: "systems",
  },
  {
    number: "04",
    title: "QA & Deployment",
    titleId: "QA & Deployment",
    description:
      "Rigorous quality assurance, performance profiling, and launch. We handle staging, production deployment, monitoring setup, and post-launch support.",
    deliverables: [
      "Automated & Manual QA",
      "Performance & Security Audit",
      "Production Deployment",
      "Monitoring & Alerting Setup",
    ],
    owner: "both",
  },
];
