/**
 * Representative engagements. These describe the *type* of work and how we
 * approach it — no client names, metrics or results are invented. Swap in real
 * case studies as clients approve them; every field maps 1:1 to the case-study
 * template in `pages/CaseStudy.tsx`.
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
  /** Drop real image paths here (e.g. "/work/search-01.webp") to replace the abstract preview. */
  images: { src?: string; alt: string }[];
  /** Shown as "Engagement" on the case study — a client name once one is approved. */
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
    images: [{ alt: "Search results interface" }, { alt: "Query analysis diagram" }],
    client: "Catalogue-heavy product business",
    scope: ["Search architecture", "Query understanding", "Relevance tuning", "Evaluation tooling"],
    sections: [
      {
        heading: "Context",
        body: "Large product catalogues live or die by search. Customers type part numbers, abbreviations, misspellings and plain-language descriptions — and expect the right product first.",
      },
      {
        heading: "Problem",
        body: "Keyword-only search misses what people mean. Abbreviations, synonyms and attribute queries (size, material, compatibility) return irrelevant or empty results, and nobody can tell whether a change made things better or worse.",
      },
      {
        heading: "Approach",
        body: "Query parsing and attribute extraction, synonym and abbreviation graphs, hybrid lexical + semantic ranking, and — before any tuning — an evaluation set built from real queries, so every change is measured instead of guessed.",
      },
      {
        heading: "Outcome",
        body: "A search system the team can reason about: relevance tracked against a fixed evaluation set, tunable without redeploying, and ready for AI-assisted features like conversational search.",
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
    images: [{ alt: "Platform dashboard" }, { alt: "System architecture diagram" }],
    client: "Founder-led product build",
    scope: ["Product design", "Frontend", "API design", "Data modelling", "Cloud deployment"],
    sections: [
      {
        heading: "Context",
        body: "A new platform that needs to launch quickly, but on foundations that won't have to be thrown away the moment it finds traction.",
      },
      {
        heading: "Problem",
        body: "Tight timelines, a small team and a long list of must-haves. The risk is shipping something fast that becomes impossible to change — or spending months on infrastructure before anyone uses it.",
      },
      {
        heading: "Approach",
        body: "Scope cut to the smallest real version, a typed React frontend, FastAPI services with clear boundaries, a relational data model designed for the next pivots, and an automated deploy pipeline from week one.",
      },
      {
        heading: "Outcome",
        body: "A working product in users' hands early, weekly demos throughout, and a codebase and pipeline that the next engineers can pick up without a rewrite.",
      },
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
    images: [{ alt: "Workflow builder" }, { alt: "Pipeline monitoring view" }],
    client: "Operations-heavy business",
    scope: ["Workflow analysis", "Integrations", "AI extraction", "Queueing & retries", "Monitoring"],
    sections: [
      {
        heading: "Context",
        body: "Skilled people spending hours every week copying data between systems, reading documents and chasing status updates.",
      },
      {
        heading: "Problem",
        body: "Manual steps are slow and error-prone, but naïve automation is worse — it fails silently, and nobody trusts it with the edge cases.",
      },
      {
        heading: "Approach",
        body: "Map the real process first, then build an event-driven pipeline connecting third-party APIs, AI-assisted document extraction, queues with retries, and human review for anything the system isn't confident about.",
      },
      {
        heading: "Outcome",
        body: "Repetitive work handled by a pipeline that is observable end to end, with an audit trail for every decision and people kept in the loop where it counts.",
      },
    ],
  },
];

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug);
