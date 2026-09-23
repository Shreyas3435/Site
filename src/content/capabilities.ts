export type CapabilityItem = { name: string; blurb: string };

export type Capability = {
  id: "product" | "engineering" | "intelligence" | "infrastructure" | "improvement";
  index: string;
  title: string;
  summary: string;
  description: string;
  items: CapabilityItem[];
  /** Short technical tokens rendered in the schematic readout. */
  signals: string[];
};

export const capabilities: Capability[] = [
  {
    id: "product",
    index: "01",
    title: "Product",
    summary: "From a blank page to something people use.",
    description:
      "We shape the idea, cut it to what matters, and ship a product that is fast, clear and built to keep evolving.",
    items: [
      { name: "Websites", blurb: "Fast, considered sites that carry a brand and convert." },
      { name: "Web Applications", blurb: "Complex, stateful interfaces that still feel simple." },
      { name: "MVPs", blurb: "The smallest real version — built on foundations that scale." },
      { name: "Internal Tools", blurb: "Dashboards and admin systems your team actually wants to use." },
    ],
    signals: ["ROUTING", "STATE", "SSR", "A11Y", "DESIGN SYSTEM"],
  },
  {
    id: "engineering",
    index: "02",
    title: "Engineering",
    summary: "Systems that are correct first, then fast.",
    description:
      "Frontend to database, we design clean boundaries, predictable APIs and data models that survive the next three pivots.",
    items: [
      { name: "Frontend", blurb: "Typed, component-driven interfaces with real performance budgets." },
      { name: "Backend", blurb: "Services that are observable, testable and boring in production." },
      { name: "APIs", blurb: "REST, GraphQL, event streams — designed as products of their own." },
      { name: "Database Architecture", blurb: "Schemas, indexing and migrations that hold up under load." },
    ],
    signals: ["REST", "GRAPHQL", "QUEUES", "SCHEMA", "TESTS"],
  },
  {
    id: "intelligence",
    index: "03",
    title: "Intelligence",
    summary: "AI where it earns its place.",
    description:
      "Retrieval, ranking and language models applied to real problems — measured, evaluated and wired into the product properly.",
    items: [
      { name: "AI Integrations", blurb: "LLMs and models embedded into workflows with guardrails and evals." },
      { name: "Search Systems", blurb: "Lexical, semantic and hybrid search tuned to your domain." },
      { name: "Recommendation Systems", blurb: "Signals, ranking and feedback loops that improve with use." },
      { name: "Automation", blurb: "Pipelines that remove repetitive human work safely." },
    ],
    signals: ["EMBEDDINGS", "BM25", "RAG", "RERANK", "EVALS"],
  },
  {
    id: "infrastructure",
    index: "04",
    title: "Infrastructure",
    summary: "The part nobody sees until it breaks.",
    description:
      "Cloud, containers and pipelines set up so deploys are routine, costs are understood and scaling is a setting — not a project.",
    items: [
      { name: "Cloud", blurb: "AWS, Azure or GCP — architected for the workload, not the brochure." },
      { name: "Deployment", blurb: "CI/CD, preview environments and safe rollbacks." },
      { name: "Performance", blurb: "Caching, CDNs and profiling where the milliseconds are." },
      { name: "Scalability", blurb: "Horizontal, vertical, or simply smarter — whichever is cheaper." },
    ],
    signals: ["IaC", "CI/CD", "CDN", "K8S", "OBSERVABILITY"],
  },
  {
    id: "improvement",
    index: "05",
    title: "Improvement",
    summary: "Make what you already have better.",
    description:
      "We step into existing codebases, find what is actually slowing you down, and fix it without stopping the business.",
    items: [
      { name: "Search Accuracy", blurb: "Relevance tuning, synonyms, analyzers and measurable quality." },
      { name: "Performance Optimization", blurb: "Profiling, query plans, bundle size and render paths." },
      { name: "Legacy Modernization", blurb: "Incremental migration off systems that hold you back." },
      { name: "Architecture Improvements", blurb: "Untangling coupling so teams can move independently." },
    ],
    signals: ["PROFILING", "P95", "REFACTOR", "MIGRATION", "AUDIT"],
  },
];
