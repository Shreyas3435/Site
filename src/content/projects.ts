/**
 * PLACEHOLDER PROJECTS
 * These describe the *type* of work only. No client names, metrics or results
 * are invented. Replace with real case studies — every field maps 1:1 to the
 * case-study template in `pages/CaseStudy.tsx`.
 */

export type ProjectVisual = "search" | "platform" | "automation";

export type CaseSection = { heading: string; body: string };

export type Project = {
  slug: string;
  index: string;
  title: string;
  kicker: string;
  summary: string;
  tags: string[];
  /** Which built-in abstract preview to render until real screenshots exist. */
  visual: ProjectVisual;
  /** PLACEHOLDER — drop real image paths here (e.g. "/work/search-01.webp"). */
  images: { src?: string; alt: string }[];
  client: string;
  scope: string[];
  sections: CaseSection[];
};

export const projects: Project[] = [
  {
    slug: "intelligent-search",
    index: "01",
    title: "Intelligent Search",
    kicker: "Search / Knowledge Systems",
    summary:
      "A product search system designed to understand synonyms, abbreviations, product attributes and natural language.",
    tags: ["Search", "AI", "Elasticsearch", "Knowledge Systems"],
    visual: "search",
    images: [
      { alt: "PLACEHOLDER — search results interface screenshot" },
      { alt: "PLACEHOLDER — query analysis diagram" },
    ],
    client: "[ Client name — to be added ]",
    scope: ["Search architecture", "Query understanding", "Relevance tuning", "Evaluation tooling"],
    sections: [
      {
        heading: "Context",
        body: "[ Placeholder ] Describe the product, the catalogue and who searches it. What made search important to the business?",
      },
      {
        heading: "Problem",
        body: "[ Placeholder ] What was failing? e.g. queries using abbreviations, part numbers or everyday language returned irrelevant or empty results.",
      },
      {
        heading: "Approach",
        body: "[ Placeholder ] Query parsing, attribute extraction, synonym and abbreviation graphs, hybrid lexical + semantic ranking, and an evaluation set to measure every change.",
      },
      {
        heading: "Outcome",
        body: "[ Placeholder ] Add real, verifiable outcomes here once approved by the client.",
      },
    ],
  },
  {
    slug: "digital-product-platform",
    index: "02",
    title: "Digital Product Platform",
    kicker: "Product / Full-stack",
    summary: "Modern web platform built end to end — interface, API, data model and cloud infrastructure.",
    tags: ["React", "FastAPI", "Database", "Cloud"],
    visual: "platform",
    images: [
      { alt: "PLACEHOLDER — platform dashboard screenshot" },
      { alt: "PLACEHOLDER — system architecture diagram" },
    ],
    client: "[ Client name — to be added ]",
    scope: ["Product design", "Frontend", "API design", "Data modelling", "Cloud deployment"],
    sections: [
      { heading: "Context", body: "[ Placeholder ] Who the platform serves and why it needed to exist." },
      { heading: "Problem", body: "[ Placeholder ] Constraints — timeline, team size, integrations, compliance." },
      {
        heading: "Approach",
        body: "[ Placeholder ] Typed React frontend, FastAPI services, relational data model and automated deployment pipeline.",
      },
      { heading: "Outcome", body: "[ Placeholder ] Add real, verifiable outcomes here once approved by the client." },
    ],
  },
  {
    slug: "automation-engine",
    index: "03",
    title: "Automation Engine",
    kicker: "Automation / Intelligence",
    summary: "Automating complex business workflows using APIs, AI and backend services.",
    tags: ["Automation", "AI", "APIs"],
    visual: "automation",
    images: [
      { alt: "PLACEHOLDER — workflow builder screenshot" },
      { alt: "PLACEHOLDER — pipeline monitoring screenshot" },
    ],
    client: "[ Client name — to be added ]",
    scope: ["Workflow analysis", "Integrations", "AI extraction", "Queueing & retries", "Monitoring"],
    sections: [
      { heading: "Context", body: "[ Placeholder ] Which workflow, who performed it, and how often." },
      { heading: "Problem", body: "[ Placeholder ] Where time was lost and where errors crept in." },
      {
        heading: "Approach",
        body: "[ Placeholder ] Event-driven pipeline connecting third-party APIs, AI-assisted document extraction and human review for edge cases.",
      },
      { heading: "Outcome", body: "[ Placeholder ] Add real, verifiable outcomes here once approved by the client." },
    ],
  },
];

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug);
