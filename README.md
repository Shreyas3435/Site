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
| **Team** | `src/content/studio.ts` → `crew`. Presented as one team of four with the disciplines and stack each covers — no names or portraits |
| FAQ | `src/content/studio.ts` → `faqs` |
| Project planner options | `src/content/planner.ts` |
| Tech stack, process steps, principles | `src/content/studio.ts` |
| Page `<title>` / meta description | `index.html` and `src/hooks/useDocumentTitle.ts` |

Remaining placeholders (socials, location) are marked `PLACEHOLDER` in `src/content/site.ts`. No client names, metrics, testimonials or results are invented anywhere.

## Contact form

Enquiries are emailed to `site.email` (arkatechworks@gmail.com) through [FormSubmit](https://formsubmit.co). There's no backend and no API key. The first time anyone submits the live form, FormSubmit sends an **"Activate form"** email to that inbox. Click it once and every enquiry after that arrives as an email, with reply-to set to the visitor. A hidden honeypot field (`_honey`) filters out simple bots. The logic is in `src/lib/enquiry.ts`.

## Hosting (Cloudflare Pages)

```bash
npx wrangler login   # once, opens the browser
npm run deploy       # builds and uploads dist/ to the "arka" Pages project
```

The site is served at `https://arka.pages.dev` (or a similar name if that one's taken). Pages falls back to `index.html` for unknown paths, so client-side routes like `/work` work on refresh.

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
