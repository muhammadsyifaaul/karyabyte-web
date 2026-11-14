/**
 * KaryaByte — Studio Data
 */

export const studio = {
  name: "KaryaByte",
  tagline: "Enterprise-grade architecture meets craft-level design.",
  taglineFull:
    "Enterprise-grade architecture meets craft-level design — delivered with two-principal agility and zero overhead.",
  positioning: "Independent Digital Product & Systems Studio",
  founded: 2022,
  location: "Indonesia",
  email: "hello@karyabyte.dev",
  website: "https://karyabyte.dev",
};

export type TeamMember = {
  id: string;
  fullName: string;
  coPrincipalTitle: string;
  name: string;
  role: string;
  roleShort: string;
  roleId: string;
  bio: string;
  disciplines: string[];
  stack: string[];
  color: string;
};

export const team: TeamMember[] = [
  {
    id: "systems",
    fullName: "Muhammad Syifaaul Jinan",
    coPrincipalTitle: "Co-Principal",
    name: "Muhammad Syifaaul Jinan",
    role: "Principal System Analyst & Fullstack Engineer",
    roleShort: "Systems & Engineering",
    roleId: "SYS.ENG — 01",
    bio: "Architects scalable systems from the ground up. Owns the full engineering stack — from database schema design and API contracts to resilient frontend rendering and production deployment pipelines. Obsessed with correctness, performance, and long-term maintainability.",
    disciplines: [
      "System Architecture",
      "Database Modeling",
      "Backend Engineering",
      "Frontend Engineering",
      "API Design & Integration",
      "QA & Reliability",
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS"],
    color: "#E4E4E7",
  },
  {
    id: "design",
    fullName: "Ardana Yaziddirrisqo",
    coPrincipalTitle: "Co-Principal",
    name: "Ardana Yaziddirrisqo",
    role: "Lead UI/UX Designer & Project Manager",
    roleShort: "Design & Product",
    roleId: "DSN.PM — 02",
    bio: "Bridges the gap between user insight and pixel-perfect execution. Leads product discovery, crafts comprehensive design systems, builds interactive prototypes, and drives sprint delivery — keeping every project aligned with both user needs and business goals.",
    disciplines: [
      "Product Discovery",
      "Design Systems",
      "Interactive Prototyping",
      "Agile Sprint Delivery",
      "Client Alignment",
      "UX Research",
    ],
    stack: ["Figma", "Framer", "Protopie", "Linear", "Notion", "Storybook"],
    color: "#A1A1AA",
  },
];

export const metrics = [
  { label: "Systems Shipped",   value: "12+", unit: "",          target: 12 },
  { label: "Years Combined Craft", value: "3+",  unit: "",       target: 3  },
  { label: "Direct Execution",  value: "100", unit: "%",         target: 100 },
  { label: "Principals",        value: "2",   unit: " Principals", target: 2 },
];
