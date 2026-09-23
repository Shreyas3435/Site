import type { ReactNode } from "react";
import { nav, site, socials } from "@/content/site";
import { useLocalTime } from "@/hooks/useLocalTime";
import { scrollToTarget, useLenis } from "@/lib/smooth-scroll";
import { LogoSlot } from "@/components/ui/LogoSlot";
import { SmartLink } from "@/components/ui/SmartLink";
import { StatusDot } from "@/components/ui/StatusDot";
import { SlidingArrow } from "@/components/ui/Arrow";

export function Footer() {
  const time = useLocalTime(site.location.timeZone);
  const lenis = useLenis();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="shell py-16 md:py-24">
        <div className="grid gap-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <LogoSlot />
            <p className="mt-6 max-w-sm text-lede text-fg-2 text-balance-pretty">{site.tagline}</p>
          </div>

          <FooterCol title="Navigate" className="md:col-span-2 md:col-start-7">
            {[{ label: "Home", to: "/" }, ...nav].map((n) => (
              <li key={n.to}>
                <SmartLink to={n.to} className="link-line text-fg-2 hover:text-fg transition-colors">
                  {n.label}
                </SmartLink>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Social" className="md:col-span-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="link-line text-fg-2 hover:text-fg transition-colors">
                  {s.label}
                </a>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Contact" className="md:col-span-2">
            <li>
              <a href={`mailto:${site.email}`} className="link-line break-all text-fg-2 hover:text-fg transition-colors">
                {site.email}
              </a>
            </li>
            <li className="text-muted">{site.location.label}</li>
          </FooterCol>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col gap-4 py-6 eyebrow text-muted md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <StatusDot label={`Status: ${site.status}`} className="text-fg-2" />
            <span className="tabular-nums">
              Local {time}
            </span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <span>
              © {year} {site.name}
            </span>
            <button
              type="button"
              onClick={() => scrollToTarget(lenis, 0)}
              className="group inline-flex items-center gap-2 uppercase transition-colors hover:text-fg"
            >
              Back to top <SlidingArrow dir="up" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="eyebrow text-dim">{title}</p>
      <ul className="mt-5 space-y-2.5 text-[0.9375rem]">{children}</ul>
    </div>
  );
}
