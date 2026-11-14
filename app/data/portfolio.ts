/**
 * KaryaByte — Portfolio / Case Studies Data
 */

export type CaseStudyTag =
  | "System Architecture" | "Web App"      | "UI/UX"
  | "Design System"       | "SaaS"         | "Dashboard";

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: number;
  tags: CaseStudyTag[];
  summary: string;
  problem: string;
  systemArchitecture: string;
  uiSolution: string;
  impact: string[];
  stack: string[];
  accentColor: string;
  keyMetric: string;      // e.g. "99.98% Uptime"
  keyMetricLabel: string; // e.g. "System Availability"
};

export const caseStudies: CaseStudy[] = [
  {
    id: "1",
    slug: "enterprise-erp-platform",
    title: "Enterprise ERP Platform",
    client: "Manufacturing Conglomerate",
    year: 2024,
    tags: ["System Architecture", "Web App", "Dashboard"],
    summary: "End-to-end ERP platform replacing a legacy on-premise system — serving 500+ concurrent internal users across 8 business units.",
    problem: "The client's 12-year-old ERP was causing daily downtime, had no mobile access, and required 3 full-time IT staff just to maintain exports. Data silos between departments blocked real-time decision-making.",
    systemArchitecture: "Microservices on AWS ECS with PostgreSQL per domain, Redis for session and caching, an event-sourcing layer via SQS for audit trails, and a Next.js SSR frontend behind a CloudFront CDN.",
    uiSolution: "Role-based dashboard system with contextual data density — executives see KPI tiles, operators see tabular work queues. Dark-mode design system with 60+ Figma components and full WCAG 2.1 AA compliance.",
    impact: ["99.98% uptime vs. prior 94%", "Data export time: 4 hours → 12 seconds", "Zero dedicated IT maintenance staff post-launch", "500+ daily active users in Week 1"],
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS ECS", "Redis", "Figma"],
    accentColor: "#E4E4E7",
    keyMetric: "99.98%",
    keyMetricLabel: "Uptime",
  },
  {
    id: "2",
    slug: "fintech-mobile-web-app",
    title: "Fintech Savings & Investment App",
    client: "Early-Stage Fintech Startup",
    year: 2024,
    tags: ["Web App", "UI/UX", "Design System", "SaaS"],
    summary: "Zero-to-one product build: concept validation, design system, and production launch of a savings and micro-investment platform in under 14 weeks.",
    problem: "The founding team had a validated concept and seed funding but no technical team. They needed a full product — from UX research to live deployment — fast enough to demonstrate traction to Series A investors.",
    systemArchitecture: "Serverless Next.js on Vercel with Supabase (PostgreSQL + Auth + Realtime), Stripe Connect for escrow flows, and a custom rule engine for investment allocation logic.",
    uiSolution: "Calm, trust-building interface inspired by Scandinavian fintech aesthetics. Onboarding flow designed with progressive disclosure to reduce KYC abandonment. Motion design reinforces security and reliability.",
    impact: ["Launched MVP in 14 weeks from zero", "2,200 sign-ups in the first 30 days", "72% onboarding completion rate (vs. 40% industry avg)", "Secured Series A with product as primary demo"],
    stack: ["Next.js", "Supabase", "TypeScript", "Stripe", "Figma", "Framer", "Vercel"],
    accentColor: "#A1A1AA",
    keyMetric: "14 wks",
    keyMetricLabel: "Zero → Launch",
  },
  {
    id: "3",
    slug: "ppob-sales-approval-platform",
    title: "Multi-Tier PPOB Sales & Approval Platform",
    client: "Fintech & Distribution Operations",
    year: 2025,
    tags: ["System Architecture", "Web App", "UI/UX"],
    summary:
      "Web-based sales reporting and multi-level authorization platform engineered to replace manual spreadsheet reconciliation across regional distribution teams.",
    problem:
      "Fragmented reporting and multi-tier approval bottlenecks delayed daily financial settlement and created blind spots in transaction auditing.",
    systemArchitecture:
      "Designed a normalized relational schema with strict Role-Based Access Control (RBAC), deterministic approval state machines, and idempotent transaction logs.",
    uiSolution:
      "Translated complex multi-level verification workflows into a clean, scannable operational dashboard with inline validation for field agents and finance supervisors.",
    impact: [
      "100% audit trail traceability across all approval tiers",
      "Daily reporting turnaround cut from hours to minutes",
      "Zero reconciliation gaps since go-live",
      "Adopted by all regional distribution teams at launch",
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "REST API", "RBAC"],
    accentColor: "#E4E4E7",
    keyMetric: "100%",
    keyMetricLabel: "Audit Traceability",
  },
  {
    id: "4",
    slug: "healthcare-referral-triage-system",
    title: "Intelligent Healthcare Referral & Triage System",
    client: "Digital Health Interoperability",
    year: 2026,
    tags: ["System Architecture", "SaaS", "UI/UX"],
    summary:
      "Privacy-first clinical referral platform combining dynamic facility scoring, HL7 FHIR R4 interoperability, and AI-assisted triage decision support.",
    problem:
      "Static hospital referral routing frequently overloaded higher-tier facilities while exposing raw patient identifiers during cross-facility handoffs.",
    systemArchitecture:
      "Engineered a Dynamic Weight Scoring (DWS) routing engine paired with HL7 FHIR R4 data exchange, clinical Safeguard Locks, and cryptographic Zero-PII E-Boarding Pass generation.",
    uiSolution:
      "Designed an AI Copilot clinical interface that surfaces facility readiness scores, capacity indicators, and step-by-step referral status in one unified view.",
    impact: [
      "Zero raw PII exposed on any generated boarding pass",
      "Accelerated clinical triage decisions via AI Copilot",
      "FHIR R4-compliant cross-facility data exchange",
      "Dynamic routing prevents higher-tier facility overload",
    ],
    stack: ["TypeScript", "FastAPI", "HL7 FHIR R4", "AI Copilot", "Next.js"],
    accentColor: "#A1A1AA",
    keyMetric: "Zero-PII",
    keyMetricLabel: "E-Boarding Pass",
  },
];

/**
 * Filter tags — derived from the union of all tags actually used across
 * the four case studies. Update this list whenever a study is added/changed.
 *
 * Active tags per study:
 *   #1 ERP:          System Architecture, Web App, Dashboard
 *   #2 Fintech:      Web App, UI/UX, Design System, SaaS
 *   #3 PPOB:         System Architecture, Web App, UI/UX
 *   #4 Healthcare:   System Architecture, SaaS, UI/UX
 */
export const filterTags: CaseStudyTag[] = [
  "System Architecture",
  "Web App",
  "UI/UX",
  "Design System",
  "SaaS",
  "Dashboard",
];
