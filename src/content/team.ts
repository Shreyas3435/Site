/**
 * The team page (/team).
 * Entries marked PLACEHOLDER are stand-ins. Replace the text and the page updates;
 * nothing else needs to change.
 *  - `photo`: put an image in `public/team/` (square works best) and set the path.
 *  - `location`, `links`: optional; anything missing or left as "#" is hidden.
 */

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  /** Short tag shown on the card, matching the disciplines in studio.ts. */
  code: string;
  photo?: string;
  location?: string;
  experience: string;
  /** Two or three sentences, max. */
  bio: string;
  /** What they're best at — three short items. */
  specialities: string[];
  stack: string[];
  links: { label: string; href: string }[];
};

const placeholderLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
];

export const team: TeamMember[] = [
  {
    slug: "shreyas-s-alva",
    name: "Shreyas S Alva",
    role: "Full-Stack Engineer",
    code: "FS",
    photo: "/team/shreyas.svg",
    experience: "2+ years",
    bio: "Full-stack developer who works across the whole product, from interface to API to database, and increasingly AI. Happy to pick up anything that needs building and see it through to production.",
    specialities: ["End-to-end web apps", "APIs & backend services", "AI-powered features"],
    stack: ["React", "TypeScript", "Node.js", "Python", "SQL", "LLMs"],
    links: placeholderLinks,
  },
  {
    // PLACEHOLDER
    slug: "engineer-02",
    name: "Engineer 02",
    role: "Frontend & Product Engineer",
    code: "UI",
    experience: "X+ years",
    bio: "Placeholder bio: two or three sentences on background, the kind of interfaces they enjoy building, and what clients can expect working with them.",
    specialities: ["Product interfaces & design systems", "Web performance", "Accessibility"],
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Motion"],
    links: placeholderLinks,
  },
  {
    // PLACEHOLDER
    slug: "engineer-03",
    name: "Engineer 03",
    role: "AI & Machine Learning Engineer",
    code: "AI",
    experience: "X+ years",
    bio: "Placeholder bio: two or three sentences on background, the AI systems they've shipped, and how they keep them grounded and measurable.",
    specialities: ["LLM applications & RAG", "Retrieval & ranking", "Evaluation & quality"],
    stack: ["LLMs", "RAG", "Embeddings", "PyTorch", "Evals"],
    links: placeholderLinks,
  },
  {
    // PLACEHOLDER
    slug: "engineer-04",
    name: "Engineer 04",
    role: "Cloud & Infrastructure Engineer",
    code: "OPS",
    experience: "X+ years",
    bio: "Placeholder bio: two or three sentences on background, the infrastructure they've run, and how they keep deploys routine and costs predictable.",
    specialities: ["Cloud architecture", "CI/CD & deploy automation", "Reliability & cost control"],
    stack: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform"],
    links: placeholderLinks,
  },
];
