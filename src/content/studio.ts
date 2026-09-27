export const stack = [
  { group: "Interface", items: ["React", "Next.js", "TypeScript", "Tailwind", "WebGL"] },
  { group: "Services", items: ["Python", "FastAPI", "Node.js", "Go", "GraphQL"] },
  { group: "Data", items: ["PostgreSQL", "MongoDB", "SQL Server", "Redis", "Elasticsearch"] },
  { group: "Intelligence", items: ["LLMs", "Embeddings", "Vector Search", "PyTorch", "Evaluation"] },
  { group: "Infrastructure", items: ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform"] },
];

export const process = [
  {
    index: "01",
    title: "Understand",
    body: "Understand the business, the problem and the constraints — before touching a line of code.",
    outputs: ["Problem framing", "Constraints", "Success criteria"],
  },
  {
    index: "02",
    title: "Design",
    body: "Define the architecture, the product experience and the technical approach.",
    outputs: ["System design", "Interface design", "Delivery plan"],
  },
  {
    index: "03",
    title: "Build",
    body: "Build quickly while keeping production-quality engineering — tested, reviewed, observable.",
    outputs: ["Working software", "Weekly demos", "Documentation"],
  },
  {
    index: "04",
    title: "Improve",
    body: "Measure, refine, optimize and scale based on how the system actually behaves.",
    outputs: ["Metrics", "Iteration", "Handover or ongoing care"],
  },
];

export const principles = [
  { lead: "Start with the problem,", rest: "not the technology." },
  { lead: "Build only what", rest: "creates value." },
  { lead: "Keep systems simple", rest: "until complexity is necessary." },
  { lead: "Make products understandable", rest: "to humans and machines." },
  { lead: "Optimize for", rest: "the long term." },
];

/**
 * The crew. Deliberately no names or portraits — the studio is presented as
 * one team of four, each experienced in the technology their layer needs.
 */
export const crew = {
  size: 4,
  disciplines: [
    {
      code: "SRV",
      title: "Backend & Search",
      body: "APIs, data models and search systems that stay correct under real traffic.",
      stack: ["Python", "FastAPI", "Node.js", "PostgreSQL", "Elasticsearch"],
    },
    {
      code: "UI",
      title: "Frontend & Product",
      body: "Fast, accessible interfaces and design systems people enjoy using.",
      stack: ["React", "Next.js", "TypeScript", "Tailwind", "Motion"],
    },
    {
      code: "AI",
      title: "AI & Machine Learning",
      body: "LLMs, retrieval and ranking — grounded in your data and properly evaluated.",
      stack: ["LLMs", "RAG", "Embeddings", "PyTorch", "Evals"],
    },
    {
      code: "OPS",
      title: "Cloud & Infrastructure",
      body: "Deploys that are routine, costs that are understood, scaling that is a setting.",
      stack: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform"],
    },
  ],
};

export const faqs = [
  {
    q: "What kind of projects do you take on?",
    a: "New products (websites, web apps, MVPs, internal tools) and improvements to existing ones — search, performance, AI features, automation and cloud. If it's technical and it matters to your business, it's worth a conversation.",
  },
  {
    q: "Who will actually work on my project?",
    a: "The four of us. There are no account managers and no junior bench — the engineers you talk to on the first call are the ones who design and build it.",
  },
  {
    q: "How do engagements usually start?",
    a: "With a short call to understand the problem, then a written proposal covering scope, approach, timeline and cost. Small, well-defined problems can start within days.",
  },
  {
    q: "Can you work with our existing team and codebase?",
    a: "Yes. A lot of our work is stepping into existing systems. We can own a problem end to end, or embed alongside your engineers and pair on the problems that matter most.",
  },
  {
    q: "What does it cost?",
    a: "It depends on scope, so we don't publish fixed prices. Share a rough budget range in the form and we'll tell you honestly what's realistic within it — including when a smaller first phase makes more sense.",
  },
  {
    q: "What happens after launch?",
    a: "Your choice: a clean handover with documentation, or ongoing care where we keep measuring, improving and scaling the system with you.",
  },
];
