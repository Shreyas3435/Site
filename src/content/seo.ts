/**
 * Search and social metadata for every route.
 * One source for both the browser (`usePageMeta` updates the head on navigation)
 * and the build (`vite.config.ts` writes a static HTML file per route with these
 * tags baked in, plus `sitemap.xml`), so crawlers see the right title and
 * description before any JavaScript runs.
 * Relative imports only: this file is also loaded by vite.config.ts.
 */
import { projects } from "./projects";

export const SITE_URL = "https://arkatechlabs.com";
export const BRAND = "Arka Tech Labs";

export type PageMeta = { path: string; title: string; description: string };

export const pages: PageMeta[] = [
  {
    path: "/",
    title: "Arka Tech Labs — Website, Web App & AI Development Studio",
    description:
      "Arka is an engineering studio building websites, web apps, MVPs, AI features and cloud infrastructure for startups and businesses in the UK, US, India and worldwide.",
  },
  {
    path: "/capabilities",
    title: "Services — Web Development, AI, Cloud & DevOps | Arka Tech Labs",
    description:
      "Website and web app development, MVPs, AI and LLM integration, search, automation, cloud and DevOps. One engineering team covering the whole stack.",
  },
  {
    path: "/work",
    title: "Work — Web, AI & Automation Projects | Arka Tech Labs",
    description:
      "Representative projects across product search, digital platforms and workflow automation, and how we approach each one.",
  },
  {
    path: "/about",
    title: "About — A Small Engineering Studio | Arka Tech Labs",
    description:
      "Arka is a small team of experienced engineers working across product, engineering, AI and cloud. You talk directly to the people who build your project.",
  },
  {
    path: "/team",
    title: "Team — The Engineers Behind Arka | Arka Tech Labs",
    description:
      "Meet the full-stack, data science and backend & cloud engineers who design and build every Arka project.",
  },
  {
    path: "/contact",
    title: "Contact — Start a Web or AI Project | Arka Tech Labs",
    description:
      "Tell us about your website, web app, AI or cloud project. Every enquiry is answered by an engineer, usually within one working day.",
  },
  ...projects.map((p) => ({
    path: `/work/${p.slug}`,
    title: `${p.title} — Case Study | Arka Tech Labs`,
    description: p.summary,
  })),
];

export function metaFor(path: string): PageMeta | undefined {
  const clean = path.length > 1 ? path.replace(/\/+$/, "") : path;
  return pages.find((p) => p.path === clean);
}

export const NOT_FOUND_TITLE = `Page not found | ${BRAND}`;
