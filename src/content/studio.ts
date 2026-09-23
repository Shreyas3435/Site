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

export type TeamMember = {
  name: string;
  role: string;
  focus: string[];
  bio: string;
  /** PLACEHOLDER — path to a portrait, e.g. "/team/name.webp". */
  photo?: string;
  links: { label: "LinkedIn" | "GitHub" | "Website"; href: string }[];
};

/** PLACEHOLDER TEAM — replace with real people. */
export const team: TeamMember[] = [
  {
    name: "Team Member",
    role: "Engineering — Backend & Search",
    focus: ["Search", "APIs", "Data"],
    bio: "[ Placeholder bio — two or three sentences on background and what they like building. ]",
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    name: "Team Member",
    role: "Engineering — Frontend & Product",
    focus: ["Interfaces", "Design systems", "Performance"],
    bio: "[ Placeholder bio — two or three sentences on background and what they like building. ]",
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    name: "Team Member",
    role: "AI / ML Engineering",
    focus: ["LLMs", "Retrieval", "Evaluation"],
    bio: "[ Placeholder bio — two or three sentences on background and what they like building. ]",
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    name: "Team Member",
    role: "Infrastructure & Cloud",
    focus: ["Cloud", "DevOps", "Reliability"],
    bio: "[ Placeholder bio — two or three sentences on background and what they like building. ]",
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
];
