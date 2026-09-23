import { capabilities } from "@/content/capabilities";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { PageHero } from "@/components/sections/PageHero";
import { Diagnostics } from "@/components/sections/Diagnostics";
import { Stack } from "@/components/sections/Stack";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Corners } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SmartLink } from "@/components/ui/SmartLink";
import { Schematic } from "@/components/visuals/Schematic";
import { InViewSchematic } from "@/components/visuals/InViewSchematic";

export default function CapabilitiesPage() {
  useDocumentTitle("Capabilities");
  return (
    <>
      <PageHero
        label="Capabilities"
        lines={["Across", "the stack."]}
        intro="Five domains, one team. Most real problems cross boundaries — interface, service, data, model, infrastructure — so we don't stop at any of them."
        aside={
          <nav aria-label="Jump to domain">
            <ul className="space-y-2">
              {capabilities.map((c) => (
                <li key={c.id}>
                  <SmartLink to={`/capabilities#${c.id}`} className="group flex items-center gap-4 eyebrow text-muted hover:text-fg">
                    <span className="text-accent">{c.index}</span>
                    <span className="link-line">{c.title}</span>
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>
        }
      />

      <div className="shell">
        {capabilities.map((c) => (
          <section
            key={c.id}
            id={c.id}
            aria-labelledby={`${c.id}-title`}
            className="grid scroll-mt-24 gap-10 border-t border-line py-20 md:py-28 lg:grid-cols-12"
          >
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <p className="eyebrow text-accent">{c.index}</p>
                <h2 id={`${c.id}-title`} className="mt-4 text-title font-medium uppercase">
                  {c.title}
                </h2>
                <p className="mt-6 text-heading font-medium text-fg-2">{c.summary}</p>
                <p className="mt-4 max-w-md text-muted">{c.description}</p>
                <div className="relative mt-10 aspect-[4/3] border border-line bg-ink-2/60">
                  <Corners />
                  <InViewSchematic>
                    <Schematic id={c.id} className="size-full p-4" />
                  </InViewSchematic>
                </div>
              </div>
            </div>
            <ul className="lg:col-span-6 lg:col-start-7">
              {c.items.map((item, k) => (
                <Reveal as="li" key={item.name} delay={k * 0.05} className="group border-b border-line py-8 first:pt-0 md:py-10">
                  <div className="flex items-baseline gap-5">
                    <span className="eyebrow text-dim transition-colors group-hover:text-accent">
                      {c.index}.{k + 1}
                    </span>
                    <div>
                      <h3 className="text-heading font-medium transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
                        {item.name}
                      </h3>
                      <p className="mt-3 max-w-md text-fg-2">{item.blurb}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
              <li className="flex flex-wrap gap-2 pt-8">
                {c.signals.map((s) => (
                  <span key={s} className="rounded-full border border-line-2 px-3 py-1 eyebrow text-[0.625rem] text-muted">
                    {s}
                  </span>
                ))}
              </li>
            </ul>
          </section>
        ))}
      </div>

      <Diagnostics />
      <Stack />
      <FinalCTA />
    </>
  );
}
