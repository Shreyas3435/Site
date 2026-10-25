import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { bodyFor, jsonLdFor, llmsTxt } from "./src/content/crawlable";
import { pages, SITE_URL, type PageMeta } from "./src/content/seo";

const escapeAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function withMeta(html: string, meta: PageMeta) {
  const url = SITE_URL + meta.path;
  const title = escapeAttr(meta.title);
  const description = escapeAttr(meta.description);
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${description}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<meta (?:property="og|name="twitter):title" content=")[^"]*/g, `$1${title}`)
    .replace(/(<meta (?:property="og|name="twitter):description" content=")[^"]*/g, `$1${description}`)
    .replace("</head>", () => jsonLdFor(meta.path).map(ld).join("") + "</head>")
    .replace('<div id="root"></div>', () => `<div id="root">${bodyFor(meta.path)}</div>`);
}

/** `<` escaped so text inside the JSON can never close the script tag. */
const ld = (data: object) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>\n`;

/**
 * After the build, writes dist/<route>.html for every route in seo.ts with
 * its own title, description, JSON-LD and crawler-readable content (see
 * crawlable.ts), plus sitemap.xml and llms.txt. The app itself is unchanged:
 * each file boots the same SPA. `<route>.html` rather than
 * `<route>/index.html`, because Cloudflare serves the former at /route as-is but
 * redirects the latter to /route/, which would disagree with the canonical URL.
 */
function seoPages(): Plugin {
  let outDir = "dist";
  return {
    name: "seo-pages",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const template = readFileSync(join(outDir, "index.html"), "utf8");
      for (const meta of pages) {
        const file = meta.path === "/" ? join(outDir, "index.html") : join(outDir, `${meta.path}.html`);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, withMeta(template, meta));
      }
      writeFileSync(join(outDir, "llms.txt"), llmsTxt());
      const today = new Date().toISOString().slice(0, 10);
      const urls = pages
        .map((p) => `  <url><loc>${SITE_URL}${p.path}</loc><lastmod>${today}</lastmod></url>`)
        .join("\n");
      writeFileSync(
        join(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPages()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
