/**
 * Global site configuration.
 * Everything marked PLACEHOLDER is intended to be replaced with real details.
 */

export const site = {
  /** PLACEHOLDER — studio name used in copy, titles and the footer. */
  name: "Studio",
  tagline: "Engineering digital products, systems and experiences.",
  description:
    "A small engineering studio building products, platforms and technical systems for founders, startups and businesses that need more than off-the-shelf solutions.",
  /** PLACEHOLDER — real inbox. */
  email: "hello@yourstudio.com",
  /** Shown in the footer + menu. Keep it honest; switch when capacity changes. */
  status: "Available for select projects",
  /** PLACEHOLDER — base city / timezone for the live clock. */
  location: { label: "Remote — Worldwide", timeZone: undefined as string | undefined },
};

export type Social = { label: string; handle: string; href: string };

/** PLACEHOLDER — replace hrefs with real profiles. */
export const socials: Social[] = [
  { label: "LinkedIn", handle: "/company/yourstudio", href: "#" },
  { label: "GitHub", handle: "@yourstudio", href: "#" },
  { label: "Instagram", handle: "@yourstudio", href: "#" },
  { label: "X", handle: "@yourstudio", href: "#" },
];

export type NavItem = { label: string; to: string };

export const nav: NavItem[] = [
  { label: "Work", to: "/work" },
  { label: "Capabilities", to: "/capabilities" },
  { label: "Process", to: "/#process" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];
