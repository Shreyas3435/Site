import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { team, type TeamMember } from "@/content/team";
import { site } from "@/content/site";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { MediaSlot } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SmartLink } from "@/components/ui/SmartLink";
import { Spotlight } from "@/components/ui/Spotlight";

export default function Team() {
  useDocumentTitle("Team");
  return (
    <>
      <PageHero
        label="Team"
        lines={["Four engineers.", "One crew."]}
        intro={`The people behind ${site.name}. Each of us owns a layer of the stack; together we cover the whole thing. Here's who you'd work with, what we're best at and what we've built.`}
      />

      {/* jump list */}
      <nav aria-label="Team members" className="border-y border-line">
        <div className="shell">
          <ul className="grid grid-cols-2 gap-px border-x border-line bg-line md:grid-cols-4">
            {team.map((m, i) => (
              <li key={m.slug} className="bg-ink">
                <SmartLink
                  to={`/team#${m.slug}`}
                  className="group flex h-full items-center justify-between gap-3 px-1 py-5 eyebrow text-fg-2 transition-colors hover:text-fg md:px-4"
                >
                  <span>
                    <span className="text-accent">
                      [{String(i + 1).padStart(2, "0")}]
                    </span>
                    &nbsp;&nbsp;{m.code}
                  </span>
                  <span className="hidden text-dim transition-colors group-hover:text-fg lg:inline">
                    {m.role.replace(/ Engineer$/, "")}
                  </span>
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {team.map((m, i) => (
        <Member key={m.slug} member={m} index={i} />
      ))}

      <FinalCTA />
    </>
  );
}

function Member({ member: m, index }: { member: TeamMember; index: number }) {
  const n = String(index + 1).padStart(2, "0");
  const links = m.links.filter((l) => l.href && l.href !== "#");

  return (
    <section
      id={m.slug}
      aria-labelledby={`${m.slug}-name`}
      className="scroll-mt-24 border-b border-line py-20 md:py-32"
    >
      <div className="shell grid gap-12 md:grid-cols-12 md:gap-10">
        {/* portrait + facts */}
        <Reveal className="md:col-span-4">
          <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
            <MediaSlot
              src={m.photo}
              alt={`Portrait of ${m.name}`}
              label="Photo"
              className="aspect-[4/5] w-full max-w-sm"
            >
              <span className="absolute left-4 top-4 eyebrow text-accent">
                [{n}]
              </span>
              <span className="absolute right-4 top-4 eyebrow text-dim">
                {m.code}
              </span>
            </MediaSlot>
            <dl className="mt-6 grid max-w-sm grid-cols-2 gap-px border border-line bg-line">
              <div className="bg-ink p-4">
                <dt className="eyebrow text-dim">Experience</dt>
                <dd className="mt-2 text-fg">{m.experience}</dd>
              </div>
              <div className="bg-ink p-4">
                <dt className="eyebrow text-dim">Based in</dt>
                <dd className="mt-2 text-fg">{m.location}</dd>
              </div>
            </dl>
            {links.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 eyebrow">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-line text-fg-2 hover:text-fg"
                    >
                      {l.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>

        {/* details */}
        <div className="md:col-span-8">
          <Reveal>
            <SectionLabel index={n}>{m.role}</SectionLabel>
            <h2
              id={`${m.slug}-name`}
              className="mt-8 text-title font-medium uppercase"
            >
              {m.name}
            </h2>
            <p className="mt-6 max-w-2xl text-lede text-fg-2">{m.bio}</p>
          </Reveal>

          <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2">
            <ListBlock title="Speciality" items={m.specialities} />
            <ListBlock title="Can help you with" items={m.canHelpWith} />
          </div>

          <Reveal className="mt-8">
            <ul aria-label="Stack" className="flex flex-wrap gap-1.5">
              {m.stack.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line-2 px-3 py-1.5 eyebrow text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-16">
            <p className="eyebrow text-muted">
              <span className="text-accent">■</span>&nbsp; Projects worked on
            </p>
            <ol className="mt-6 border-t border-line">
              {m.projects.map((p, k) => (
                <Reveal
                  as="li"
                  key={k}
                  delay={k * 0.06}
                  className="border-b border-line"
                >
                  <Spotlight className="grid gap-3 py-6 md:grid-cols-12 md:gap-6 md:px-4">
                    <div className="flex items-baseline gap-4 md:col-span-5">
                      <span className="eyebrow text-dim">{p.year}</span>
                      <div>
                        <h3 className="text-lg font-medium text-fg">
                          {p.name}
                        </h3>
                        <p className="mt-1 eyebrow text-accent">{p.kind}</p>
                      </div>
                    </div>
                    <p className="text-fg-2 md:col-span-5">{p.summary}</p>
                    <p className="eyebrow text-muted md:col-span-2 md:text-right">
                      {p.role}
                    </p>
                  </Spotlight>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <Reveal className="bg-ink p-6 md:p-8">
      <p className="eyebrow text-muted">{title}</p>
      <ul className="mt-5 space-y-3">
        {items.map((it) => (
          <li key={it} className="flex gap-3 text-fg">
            <span
              aria-hidden="true"
              className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent"
            />
            {it}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
