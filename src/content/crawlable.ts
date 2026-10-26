/**
 * Plain-HTML versions of each page, for crawlers that don't run JavaScript
 * (most AI assistants' bots, link previews, and Google's first pass).
 * `vite.config.ts` puts `bodyFor(path)` inside `<div id="root">` of each route's
 * HTML file; React replaces it as soon as the app mounts, so visitors see the
 * normal site. The text comes from the same content files as the app, so the
 * two never drift apart. Also builds `llms.txt` and per-page JSON-LD.
 * Relative imports only: this file is loaded by vite.config.ts.
 */
import { capabilities } from "./capabilities";
import { projects } from "./projects";
import { BRAND, pages, SITE_URL } from "./seo";
import { site } from "./site";
import { crew, faqs, principles, process, stack } from "./studio";
import { team } from "./team";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const ul = (items: string[]) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;

const nav = () =>
  `<nav aria-label="Site"><ul>${pages
    .filter((p) => !p.path.startsWith("/work/"))
    .map((p) => `<li><a href="${p.path}">${esc(p.title.split(/ — | \| /)[0])}</a></li>`)
    .join("")}</ul></nav>`;

const contactLine = () =>
  `<p>Start a project: <a href="/contact">enquiry form</a> or email <a href="mailto:${site.email}">${site.email}</a>.</p>`;

const services = () =>
  capabilities
    .map(
      (c) =>
        `<section><h3>${esc(c.title)}: ${esc(c.summary)}</h3><p>${esc(c.description)}</p>${ul(
          c.items.map((i) => `<strong>${esc(i.name)}</strong>: ${esc(i.blurb)}`),
        )}</section>`,
    )
    .join("");

const processHtml = () =>
  `<ol>${process.map((s) => `<li><strong>${esc(s.title)}</strong>: ${esc(s.body)}</li>`).join("")}</ol>`;

const faqHtml = () =>
  faqs.map((f) => `<section><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></section>`).join("");

const disciplines = () =>
  ul(crew.disciplines.map((d) => `<strong>${esc(d.title)}</strong>: ${esc(d.body)} (${esc(d.stack.join(", "))})`));

const teamHtml = () =>
  team
    .map(
      (m) =>
        `<section><h3>${esc(m.name)}, ${esc(m.role)}</h3><p>${esc(m.bio)}</p>${ul(m.specialities.map(esc))}<p>Stack: ${esc(m.stack.join(", "))}</p></section>`,
    )
    .join("");

function page(path: string): string {
  switch (path) {
    case "/":
      return `<h1>${BRAND}: website, web app and AI development studio</h1>
<p>${esc(site.description)}</p>
<p>We work with founders, startups and businesses in the United Kingdom, the United States, India and worldwide, remotely.</p>
<h2>Services</h2>${services()}
<h2>How we work</h2>${processHtml()}
<h2>Who you work with</h2><p>A small team of engineers covering every layer of the stack. You talk directly to the people who build your project. <a href="/team">Meet the team</a>.</p>${disciplines()}
<h2>Frequently asked questions</h2>${faqHtml()}`;
    case "/capabilities":
      return `<h1>Services: web development, AI, cloud and DevOps</h1>
<p>Five domains, one team. Most real problems cross boundaries (interface, service, data, model, infrastructure), so we don't stop at any of them.</p>
${services()}
<h2>Technology</h2>${ul(stack.map((g) => `<strong>${esc(g.group)}</strong>: ${esc(g.items.join(", "))}`))}`;
    case "/work":
      return `<h1>Work: web, AI and automation projects</h1>
<p>Representative systems across search, product and automation. Full write-ups are added as clients approve them.</p>
${projects
  .map(
    (p) =>
      `<section><h2><a href="/work/${p.slug}">${esc(p.title)}</a></h2><p>${esc(p.kicker)}</p><p>${esc(p.summary)}</p></section>`,
  )
  .join("")}`;
    case "/about":
      return `<h1>About ${BRAND}</h1>
<p>${esc(site.name)} is a small team of experienced engineers. We work independently and together (engineering, product, AI and design) on the problems that don't fit neatly into a template.</p>
<h2>What we cover</h2>${disciplines()}
<h2>Principles</h2>${ul(principles.map((p) => esc(`${p.lead} ${p.rest}`)))}
<h2>How we work</h2>${processHtml()}`;
    case "/team":
      return `<h1>The team behind ${BRAND}</h1>
<p>Each of us owns a layer of the stack; together we cover the whole thing.</p>${teamHtml()}`;
    case "/contact":
      return `<h1>Contact ${BRAND}</h1>
<p>Tell us about your website, web app, AI or cloud project. Every enquiry is answered by an engineer.</p>
<p>Email: <a href="mailto:${site.email}">${site.email}</a></p>
<h2>Questions clients ask</h2>${faqHtml()}`;
  }
  const project = projects.find((p) => `/work/${p.slug}` === path);
  if (project) {
    return `<h1>${esc(project.title)}: case study</h1>
<p>${esc(project.kicker)}</p><p>${esc(project.summary)}</p>
<p>Engagement: ${esc(project.client)}. Scope: ${esc(project.scope.join(", "))}.</p>
${project.sections.map((s) => `<h2>${esc(s.heading)}</h2><p>${esc(s.body)}</p>`).join("")}`;
  }
  return "";
}

/** Crawler-readable markup for a route, placed inside #root until React mounts. */
export function bodyFor(path: string): string {
  const main = page(path);
  if (!main) return "";
  return `<div class="crawl-fallback"><header><a href="/">${BRAND}</a>${nav()}</header><main>${main}</main><footer>${contactLine()}</footer></div>`;
}

/** Extra schema.org data for a route, beyond the site-wide block in index.html. */
export function jsonLdFor(path: string): object[] {
  if (path === "/") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ];
  }
  if (path === "/team") {
    return team.map((m) => ({
      "@context": "https://schema.org",
      "@type": "Person",
      name: m.name,
      jobTitle: m.role,
      description: m.bio,
      knowsAbout: m.stack,
      worksFor: { "@id": `${SITE_URL}/#studio` },
      ...(m.photo ? { image: SITE_URL + m.photo } : {}),
      sameAs: m.links.filter((l) => l.href && l.href !== "#").map((l) => l.href),
    }));
  }
  return [];
}

/** https://llmstxt.org — a plain-text brief on the studio for AI assistants. */
export function llmsTxt(): string {
  const lines = [
    `# ${BRAND}`,
    "",
    `> ${site.description} Works remotely with clients in the United Kingdom, the United States, India and worldwide.`,
    "",
    `${BRAND} (also "${site.name}") designs and builds websites, web applications, MVPs, internal tools, AI and LLM features, search, workflow automation and cloud infrastructure. Clients talk directly to the engineers who build their project; there are no account managers. Contact: ${site.email} or ${SITE_URL}/contact.`,
    "",
    "## Services",
    "",
    ...capabilities.map(
      (c) => `- ${c.title}: ${c.description} Includes ${c.items.map((i) => i.name).join(", ")}.`,
    ),
    "",
    "## Team",
    "",
    ...team.map((m) => `- ${m.name}, ${m.role}: ${m.bio}`),
    "",
    "## How engagements work",
    "",
    ...faqs.map((f) => `- ${f.q} ${f.a}`),
    "",
    "## Pages",
    "",
    ...pages.map((p) => `- [${p.title}](${SITE_URL}${p.path}): ${p.description}`),
    "",
  ];
  return lines.join("\n");
}
