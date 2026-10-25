/**
 * The team page (/team).
 * Full profiles go in `team`; engineers still to be written up go in `upcoming`.
 *  - `photo`: put an image in `public/team/` (square works best) and set the path.
 *  - `experience`, `location`, `links`: optional; anything missing or left as "#" is hidden.
 */

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  /** Short tag shown on the card, matching the disciplines in studio.ts. */
  code: string;
  photo?: string;
  location?: string;
  experience?: string;
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
    bio: "Full-stack developer who works across the whole product, from interface to API to database, and increasingly AI: agents, MCP integrations and the developer tooling around them. Likes to start with the plan: shaping the product and its architecture before the first line of code, then seeing it through to production.",
    specialities: ["Product planning & architecture", "End-to-end web apps", "AI agents & MCP integrations"],
    stack: ["React", "Next.js", "TypeScript", "Node.js", "Python", "FastAPI", "PostgreSQL", "LLMs"],
    links: [
      { label: "GitHub", href: "https://github.com/Shreyas3435" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/shreyas-alva-baa888227" },
      { label: "Portfolio", href: "https://portfolio-six-bice-90.vercel.app" },
    ],
  },
  {
    slug: "sahana-h-r",
    name: "Sahana H R",
    role: "Data Science Analyst",
    code: "AI",
    photo: "/team/sahana.svg",
    experience: "1.5+ years",
    bio: "Data scientist working across Python, SQL, machine learning and ETL pipelines. Builds models and dashboards, writes complex SQL and runs the validation and quality checks that keep results trustworthy, and increasingly builds AI-driven tools, including LLM-based applications.",
    specialities: ["Machine learning & data analysis", "ETL pipelines & data quality", "LLM-based applications"],
    stack: ["Python", "SQL", "Machine learning", "ETL", "LLMs", "Dashboards"],
    links: placeholderLinks,
  },
  {
    slug: "nanda-kishore-k-v",
    name: "Nanda Kishore K V",
    role: "Backend & Cloud Engineer",
    code: "OPS",
    photo: "/team/nanda.svg",
    bio: "Software engineer focused on reliable backend systems, scalable microservices and cloud-native applications. Enjoys designing clean architectures, building REST APIs, working with databases and automating complex workflows.",
    specialities: ["Backend development & microservices", "REST APIs & database engineering", "Cloud automation & infrastructure"],
    stack: ["Python", "FastAPI", "PostgreSQL", "AWS", "Java", "SQL", "Microservices"],
    links: placeholderLinks,
  },
];

/**
 * Engineers whose profiles aren't written yet. Shown as cards stacked behind the
 * live profiles, with only the role and "Profile coming soon". When a profile is
 * ready, delete it from here and add a full entry to `team` above.
 */
export const upcoming: { code: string; role: string }[] = [];
