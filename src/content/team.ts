/**
 * The team page (/team).
 * Full profiles go in `team`; engineers still to be written up go in `upcoming`.
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
    bio: "Full-stack developer who works across the whole product, from interface to API to database, and increasingly AI. Likes to start with the plan: shaping the product and its architecture before the first line of code, then seeing it through to production.",
    specialities: ["Product planning & architecture", "End-to-end web apps", "APIs & AI-powered features"],
    stack: ["React", "TypeScript", "Node.js", "Python", "SQL", "LLMs"],
    links: placeholderLinks,
  },
];

/**
 * Engineers whose profiles aren't written yet. Shown as cards stacked behind the
 * live profiles, with only the role and "Profile coming soon". When a profile is
 * ready, delete it from here and add a full entry to `team` above.
 */
export const upcoming: { code: string; role: string }[] = [
  { code: "AI", role: "AI & Machine Learning Engineer" },
  { code: "OPS", role: "Cloud & Infrastructure Engineer" },
];
