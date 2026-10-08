/**
 * The team page (/team).
 * PLACEHOLDER: every name, bio, project and link below is a stand-in. Replace
 * the text and the page updates; nothing else needs to change.
 *  - `photo`: put a portrait in `public/team/` (e.g. "/team/engineer-01.webp", ~4:5) and set the path.
 *  - `links`: entries left as "#" are hidden automatically.
 *  - `projects`: 2–4 per person is plenty. Only list work you can talk about publicly.
 */

export type TeamProject = {
  name: string;
  /** e.g. "E-commerce search", "SaaS platform" */
  kind: string;
  year: string;
  /** What this person did on it, in one line. */
  role: string;
  summary: string;
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  /** Short tag shown on the card, matching the disciplines in studio.ts. */
  code: string;
  photo?: string;
  location: string;
  experience: string;
  bio: string;
  /** What they're best at. */
  specialities: string[];
  /** The problems a client can bring to them. */
  canHelpWith: string[];
  stack: string[];
  projects: TeamProject[];
  links: { label: string; href: string }[];
};

const placeholderLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
];

export const team: TeamMember[] = [
  {
    slug: "engineer-01",
    name: "Engineer 01",
    role: "Backend & Search Engineer",
    code: "SRV",
    location: "City, Country",
    experience: "X+ years",
    bio: "Placeholder bio: two or three sentences on background, the kind of systems they enjoy building, and what clients can expect working with them.",
    specialities: ["API design & data modelling", "Search relevance & ranking", "Performance under real traffic"],
    canHelpWith: [
      "Slow or unreliable backends",
      "Search that returns the wrong results",
      "Designing a new API or data model",
      "Database and query performance",
    ],
    stack: ["Python", "FastAPI", "Node.js", "PostgreSQL", "Elasticsearch"],
    projects: [
      {
        name: "Project name",
        kind: "Product search",
        year: "20XX",
        role: "Lead backend engineer",
        summary: "One line on what the project was and what changed because of the work.",
      },
      {
        name: "Project name",
        kind: "Internal API platform",
        year: "20XX",
        role: "Backend engineer",
        summary: "One line on what the project was and what changed because of the work.",
      },
    ],
    links: placeholderLinks,
  },
  {
    slug: "engineer-02",
    name: "Engineer 02",
    role: "Frontend & Product Engineer",
    code: "UI",
    location: "City, Country",
    experience: "X+ years",
    bio: "Placeholder bio: two or three sentences on background, the kind of interfaces they enjoy building, and what clients can expect working with them.",
    specialities: ["Product interfaces & design systems", "Web performance", "Accessibility"],
    canHelpWith: [
      "Redesigning or rebuilding a website",
      "Slow, clunky or dated interfaces",
      "Turning designs into a production app",
      "Setting up a reusable design system",
    ],
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Motion"],
    projects: [
      {
        name: "Project name",
        kind: "SaaS dashboard",
        year: "20XX",
        role: "Lead frontend engineer",
        summary: "One line on what the project was and what changed because of the work.",
      },
      {
        name: "Project name",
        kind: "Marketing site",
        year: "20XX",
        role: "Design & build",
        summary: "One line on what the project was and what changed because of the work.",
      },
    ],
    links: placeholderLinks,
  },
  {
    slug: "engineer-03",
    name: "Engineer 03",
    role: "AI & Machine Learning Engineer",
    code: "AI",
    location: "City, Country",
    experience: "X+ years",
    bio: "Placeholder bio: two or three sentences on background, the AI systems they've shipped, and how they keep them grounded and measurable.",
    specialities: ["LLM applications & RAG", "Retrieval & ranking", "Evaluation & quality"],
    canHelpWith: [
      "Adding AI features to a product",
      "Chatbots and assistants over your own data",
      "Automating manual, document-heavy work",
      "Measuring whether an AI feature actually works",
    ],
    stack: ["LLMs", "RAG", "Embeddings", "PyTorch", "Evals"],
    projects: [
      {
        name: "Project name",
        kind: "Knowledge assistant",
        year: "20XX",
        role: "ML engineer",
        summary: "One line on what the project was and what changed because of the work.",
      },
      {
        name: "Project name",
        kind: "Document automation",
        year: "20XX",
        role: "Lead engineer",
        summary: "One line on what the project was and what changed because of the work.",
      },
    ],
    links: placeholderLinks,
  },
  {
    slug: "engineer-04",
    name: "Engineer 04",
    role: "Cloud & Infrastructure Engineer",
    code: "OPS",
    location: "City, Country",
    experience: "X+ years",
    bio: "Placeholder bio: two or three sentences on background, the infrastructure they've run, and how they keep deploys routine and costs predictable.",
    specialities: ["Cloud architecture", "CI/CD & deploy automation", "Reliability & cost control"],
    canHelpWith: [
      "Moving to the cloud or between clouds",
      "Fragile, manual deployments",
      "Cloud bills that keep growing",
      "Downtime, monitoring and scaling",
    ],
    stack: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform"],
    projects: [
      {
        name: "Project name",
        kind: "Cloud migration",
        year: "20XX",
        role: "Infrastructure lead",
        summary: "One line on what the project was and what changed because of the work.",
      },
      {
        name: "Project name",
        kind: "Platform reliability",
        year: "20XX",
        role: "DevOps engineer",
        summary: "One line on what the project was and what changed because of the work.",
      },
    ],
    links: placeholderLinks,
  },
];
