import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { team, type TeamMember } from "@/content/team";
import { site } from "@/content/site";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { MediaSlot } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";

export default function Team() {
  useDocumentTitle("Team");
  return (
    <>
      <PageHero
        label="Team"
        lines={["Four engineers.", "One crew."]}
        intro={`The people behind ${site.name}. Each of us owns a layer of the stack; together we cover the whole thing.`}
      />

      <section aria-label="Team members" className="border-t border-line py-16 md:py-24">
        <div className="shell">
          <ul className="grid gap-px border border-line bg-line md:grid-cols-2">
            {team.map((m, i) => (
              <Member key={m.slug} member={m} index={i} />
            ))}
          </ul>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}

function Member({ member: m, index }: { member: TeamMember; index: number }) {
  const n = String(index + 1).padStart(2, "0");
  const links = m.links.filter((l) => l.href && l.href !== "#");
  const facts = [m.experience, m.location].filter(Boolean).join(" · ");

  return (
    <li id={m.slug} aria-labelledby={`${m.slug}-name`} className="scroll-mt-24 bg-ink">
      <Reveal delay={(index % 2) * 0.06} className="flex h-full flex-col p-6 md:p-8">
        <div className="flex items-start gap-5">
          <MediaSlot
            src={m.photo}
            alt={`Portrait of ${m.name}`}
            className="size-24 shrink-0 md:size-28"
          />
          <div className="min-w-0 pt-1">
            <p className="eyebrow text-dim">
              <span className="text-accent">[{n}]</span>&nbsp;&nbsp;{m.code}
            </p>
            <h2 id={`${m.slug}-name`} className="mt-3 text-2xl font-medium uppercase">
              {m.name}
            </h2>
            <p className="mt-1 text-fg-2">{m.role}</p>
            <p className="mt-2 eyebrow text-muted">{facts}</p>
          </div>
        </div>
  
        <p className="mt-6 text-fg-2">{m.bio}</p>
  
        <ul className="mt-5 space-y-2">
          {m.specialities.map((s) => (
            <li key={s} className="flex gap-3 text-fg">
              <span
                aria-hidden="true"
                className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent"
              />
              {s}
            </li>
          ))}
        </ul>
  
        <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-1.5">
          {m.stack.map((t) => (
            <li
              key={t}
              className="rounded-full border border-line-2 px-3 py-1.5 eyebrow text-muted"
            >
              {t}
            </li>
          ))}
        </ul>
  
        {links.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-6 eyebrow">
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
      </Reveal>
    </li>
  );
}
