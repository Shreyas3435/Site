# Arka site — phase 1 (frontend)

React 19 + TypeScript + Vite + Tailwind v4. Animation with `motion`, smooth scroll with `lenis`, routing with `react-router`.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build → dist/
npm run preview
```

## Replacing placeholders

All content is data in `src/content/`. Components only render it, so real details are a data change.

| What | Where |
| --- | --- |
| Studio name, tagline, email, status line, location/timezone | `src/content/site.ts` → `site` |
| Social links | `src/content/site.ts` → `socials` (profiles left as `"#"` are hidden automatically) |
| Navigation | `src/content/site.ts` → `nav` |
| **Logo** | `src/components/Logo.tsx` (`<Logo />` mark + wordmark, `<LogoMark />` mark only; `animated={false}` for static use). Animation styles live in `src/styles/globals.css` under `.ar-*`. Favicon: `public/favicon.svg`. On light backgrounds: A `#09090a`, sun `#ff5b2e`, wordmark `#09090a` |
| Capabilities (5 domains × 4 items) | `src/content/capabilities.ts` |
| "Already have a product?" rows | `src/content/diagnostics.ts` |
| **Case studies** | `src/content/projects.ts`. Representative engagements (no invented clients or results). Add `images[].src` (e.g. `/work/search-01.webp` in `public/`) and the real screenshot replaces the abstract preview automatically |
| **Team** | `src/content/studio.ts` → `crew`. Presented as one small team (no headcount) with the disciplines and stack each covers — no names or portraits |
| **Team page** (`/team`) | `src/content/team.ts`: name, role, bio, specialities, "can help with", stack, projects and links for each engineer. Portraits go in `public/team/` with the path set as `photo`. All entries are placeholders for now |
| FAQ | `src/content/studio.ts` → `faqs` |
| Project planner options | `src/content/planner.ts` |
| Tech stack, process steps, principles | `src/content/studio.ts` |
| Page `<title>` / meta description | `src/content/seo.ts` (shared social tags in `index.html`) |

Remaining placeholders (socials, location) are marked `PLACEHOLDER` in `src/content/site.ts`. No client names, metrics, testimonials or results are invented anywhere.

## Contact form

Enquiries post to `/api/enquiry`, handled by the Cloudflare Worker in `worker/index.ts`. It emails each one to arkatechworks@gmail.com through Cloudflare Email Routing (the `send_email` binding in `wrangler.jsonc`), sent from `enquiries@arkatechlabs.com` with reply-to set to the visitor. No third-party form service is involved. A hidden honeypot field filters out simple bots. If sending fails, the form offers a pre-filled email instead (`mailtoFor` in `src/lib/enquiry.ts`).

One-time setup in the Cloudflare dashboard: enable **Email Routing** on arkatechlabs.com and add arkatechworks@gmail.com as a verified destination address. The Vercel copy has no `/api`, so there the form always falls back to email.

## Hosting (Cloudflare)

The site runs as a Cloudflare Worker named `site` (see `wrangler.jsonc`). Static files are served from `dist/`, unknown paths fall back to `index.html` for client-side routes, and only `/api/*` runs the Worker code.

The Worker is connected to this repo in the Cloudflare dashboard (Settings → Build: build command `npm run build`, deploy command `npx wrangler deploy`), so every push to `main` redeploys https://arkatechlabs.com. To deploy by hand instead:

```bash
npx wrangler login   # once, opens the browser
npm run deploy       # builds and deploys the "site" Worker
```

Vercel (project `arka`, https://arkatechworks.vercel.app) also builds every push to `main`; `vercel.json` holds its SPA rewrite.

## Search (SEO)

Titles and descriptions for every route live in `src/content/seo.ts`. At build time `vite.config.ts` writes `dist/<route>.html` for each route with those tags baked in, plus `sitemap.xml`; in the browser `usePageMeta` keeps the head in step on navigation. `index.html` holds the shared social tags and the schema.org `ProfessionalService` data, `public/og.png` is the link-preview image and `public/robots.txt` points crawlers at the sitemap. A new route needs an entry in `seo.ts` (and a case in `crawlable.ts`).

AI assistants (ChatGPT, Perplexity, Claude, Google's AI answers) mostly read raw HTML without running JavaScript, so `src/content/crawlable.ts` renders each page's content as plain HTML from the same content files. The build places it inside `<div id="root">` of that route's HTML (React replaces it on mount), adds per-page JSON-LD (FAQ on the home page, people on `/team`) and writes `llms.txt`. `robots.txt` explicitly allows the AI search crawlers.

## Interactive pieces

- **Project planner** (`sections/Planner.tsx`, home `#planner`): visitors pick needs, stage and timeline; the console assembles the crew, engagement shape and a draft brief, and "Use this brief" pre-fills the enquiry form (via `lib/brief.ts`).
- **Floating CTA** (`layout/FloatingCTA.tsx`): appears after the hero, hides over the planner and contact form.
- **Crew grid** with pointer-follow spotlight (`ui/Spotlight.tsx`), **FAQ** accordion (`sections/FAQ.tsx`).

## Structure

```
src/
  content/          all copy and data (CMS-ready shapes)
  components/
    layout/         Layout (routes + transitions), Header, MobileMenu, Footer, PageShell
    sections/       page sections: Hero, Capabilities, Diagnostics, Work, Stack, Process, …
    ui/             primitives: Button, SmartLink, Magnetic, RevealText, Marquee, MediaSlot, …
    visuals/        SystemOrb (hero canvas), Schematic (capability diagrams), ProjectVisual
    cursor/         custom cursor
  hooks/            media queries, local time, document title
  lib/              smooth scroll (Lenis), enquiry API stub, easing tokens
  pages/            one file per route (secondary routes are lazy-loaded)
  styles/globals.css design tokens (@theme), base styles, utilities
```

**Adding a page:** create `src/pages/X.tsx`, register it in `components/layout/Layout.tsx` and add it to `nav` in `content/site.ts`. It gets the page transition automatically.

**Links:** use `SmartLink` for every link. It handles router links, `/#section` smooth scrolling (same page or cross-page) and external/mailto links.

## Design system

- **Colour:** near-black `ink` scale, off-white `fg`, `muted`/`dim` greys, hairline `line` borders, and one accent (`accent`, signal orange). Tokens live in `styles/globals.css` under `@theme`.
- **Type:** Geist + Geist Mono (self-hosted via Fontsource). Scale: `text-display`, `text-mega`, `text-title`, `text-heading`, `text-lede`, and the mono `eyebrow` utility for labels.
- **Motion:** shared easing in `lib/easing.ts`. `RevealText` (masked word reveal) and `Reveal` (fade-up) are the two entrance patterns.

## Behaviour notes

- **Custom cursor** only turns on for fine pointers (`hover: hover` + `pointer: fine`). Touch devices keep native behaviour. Text inputs always show the native caret. Add `data-cursor="Label"` to any element to show a label in the cursor ring.
- **Reduced motion:** Lenis is disabled, the hero canvas draws one static frame, the horizontal work scroller becomes a vertical list, and CSS animations are cut short.
- **Performance:** the hero canvas is 2D (no WebGL). It caps DPR at 1.75, scales point count to the viewport, and pauses when off-screen or when the tab is hidden. The cursor's rAF loop sleeps when the pointer is still. Secondary routes are code-split.
