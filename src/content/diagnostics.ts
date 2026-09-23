export type Diagnostic = {
  code: string;
  symptom: string;
  treatment: string;
  detail: string;
  checks: string[];
};

export const diagnostics: Diagnostic[] = [
  {
    code: "PERF",
    symptom: "Slow website",
    treatment: "Performance optimization",
    detail: "Profile the real bottleneck — render path, bundle, queries or network — then fix it where it matters.",
    checks: ["Core Web Vitals", "Bundle analysis", "Query plans", "Caching layers"],
  },
  {
    code: "SRCH",
    symptom: "Poor search",
    treatment: "Search relevance engineering",
    detail: "Analyzers, synonyms, ranking signals and evaluation sets so results match what people actually mean.",
    checks: ["Query analysis", "Synonym graphs", "Hybrid ranking", "Relevance evals"],
  },
  {
    code: "ARCH",
    symptom: "Messy backend",
    treatment: "Architecture improvement",
    detail: "Draw clear boundaries, remove accidental coupling and make the system easier to change safely.",
    checks: ["Dependency map", "Service boundaries", "Data ownership", "Test coverage"],
  },
  {
    code: "AUTO",
    symptom: "Manual workflow",
    treatment: "Automation",
    detail: "Replace repetitive human steps with reliable pipelines — with humans kept in the loop where it counts.",
    checks: ["Process mapping", "Integrations", "Queues & retries", "Audit trail"],
  },
  {
    code: "LGCY",
    symptom: "Legacy system",
    treatment: "Modernization",
    detail: "Incremental, reversible migration. No big-bang rewrites, no frozen roadmap.",
    checks: ["Strangler pattern", "Data migration", "Parity testing", "Cutover plan"],
  },
  {
    code: "INTL",
    symptom: "Basic product",
    treatment: "AI capabilities",
    detail: "Add intelligence that is grounded in your data, evaluated properly and useful on day one.",
    checks: ["Use-case fit", "Retrieval", "Guardrails", "Evaluation"],
  },
];
